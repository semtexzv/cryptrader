use crate::prelude::*;

use std::mem;
use ta::{
    indicators::*,
};

use rlua::{self, Lua, UserData, UserDataMethods};
use crate::{StrategyInput, TradingStrategy};
use crate::EvalError;

pub struct LuaStrategy {
    lua: Box<Lua>,
    src: String,
}


impl LuaStrategy {
    pub fn from_file(path: &str) -> Result<LuaStrategy> {
        return Self::new(&::std::fs::read_to_string(::std::path::Path::new(path))?);
    }
    pub fn new(src: &str) -> Result<LuaStrategy> {
        let lua = Box::new(Lua::new());

        let x: Result<(), rlua::Error> = lua.context(|ctx| {
            register_ta(ctx).unwrap();
            init_saferun(ctx).unwrap();
            Ok(())
        });

        let _ = x?;

        return Ok(LuaStrategy {
            lua,
            src: src.into(),
        });
    }

    pub fn set_data(&self, data: &StrategyInput) {
        self.lua.context(|ctx| {
            ctx.globals()
                .set("__ohlc",
                     data.ohlc
                         .iter()
                         .map(|(k, v)| { LuaOhlc(v.clone()) })
                         .collect::<Vec<LuaOhlc>>()).unwrap();
        });
    }
    pub fn execute(&self) -> Result<TradingPosition, EvalError> {
        return self.lua.context(|ctx| {
            debug!("Executing strategy");
            let sandbox: rlua::Function = ctx.globals().get("safe_run").unwrap();

            let res = sandbox.call::<_, (rlua::Value, rlua::Value)>(self.src.clone());

            if let Err(e) = res {
                return Err(EvalError::InvalidStrategy(format!("Could not launch strategy: {}", e)));
            }
            let (msg, error) = res.unwrap();


            return match (msg, error) {
                (rlua::Value::Number(n), _) => {
                    Ok(if n < 0.0 { TradingPosition::Short } else { TradingPosition::Long })
                }
                (rlua::Value::String(ref s), _) if s.to_str().is_ok() => {
                    let v = TradingPosition::from_str(&s.to_str().unwrap())
                        .map_err(|e| EvalError::InvalidStrategy(format!("Expected `short` `long` or `neutral`, {} was provided", s.to_str().unwrap())));
                    v
                }
                (_, rlua::Value::String(ref s)) => {
                    Err(EvalError::InvalidStrategy(format!("Invalid strategy output : {}", s.to_str().unwrap())))
                }
                (_, e) => {
                    Err(EvalError::InvalidStrategy(format!("Invalid strategy output : {:?}", e)))
                }
            };
        });
    }
}

impl TradingStrategy for LuaStrategy {
    fn decide(&self, data: &StrategyInput) -> Result<TradingPosition, EvalError> {
        self.set_data(data);
        return self.execute();
    }
}

#[derive(Clone, Debug)]
struct LuaOhlc(pub Ohlc);


impl UserData for LuaOhlc {
    fn add_methods<'lua, T: UserDataMethods<'lua, Self>>(_methods: &mut T) {
        _methods.add_method("time", |_, ohlc, ()| Ok(ohlc.0.time));
        _methods.add_method("open", |_, ohlc, ()| Ok(ohlc.0.open));
        _methods.add_method("high", |_, ohlc, ()| Ok(ohlc.0.high));
        _methods.add_method("low", |_, ohlc, ()| Ok(ohlc.0.low));
        _methods.add_method("close", |_, ohlc, ()| Ok(ohlc.0.close));
        _methods.add_method("volume", |_, ohlc, ()| Ok(ohlc.0.vol));
    }
}

pub struct LuaIndicator<T: ta::Next<f64> + 'static + ta::Reset> {
    indicator: T,
}

impl<T> UserData for LuaIndicator<T>
    where T: ta::Next<f64> + 'static + ta::Reset, for<'aa> T::Output: rlua::ToLuaMulti<'aa> + Clone + 'static
{
    fn add_methods<'lua, M: UserDataMethods<'lua, Self>>(_methods: &mut M) {
        _methods.add_meta_method_mut(rlua::MetaMethod::Call, |lua, this, ()| {
            let ohlc = lua.globals().get::<&str, Vec<LuaOhlc>>("__ohlc").unwrap();
            this.indicator.reset();

            unsafe {
                let mut last = mem::zeroed();
                for x in ohlc.iter() {
                    last = this.indicator.next(x.0.close);
                }
                return Ok(last);
            }
        });
    }
}

pub struct LuaPairData {}

impl rlua::UserData for LuaPairData {
    fn add_methods<'lua, T: UserDataMethods<'lua, Self>>(_methods: &mut T) {}
}

fn init_saferun(lua: rlua::Context) -> Result<(), rlua::Error> {
    let src = r#"
-- save a pointer to globals that would be unreachable in sandbox
local e=_ENV

-- sample sandbox environment
sandbox_env = {
  ta = ta,
  __ohlc = __ohlc,

  ipairs = ipairs,
  next = next,
  pairs = pairs,
  pcall = pcall,
  tonumber = tonumber,
  tostring = tostring,
  type = type,
  unpack = unpack,
  coroutine = { create = coroutine.create, resume = coroutine.resume,
      running = coroutine.running, status = coroutine.status,
      wrap = coroutine.wrap },
  string = { byte = string.byte, char = string.char, find = string.find,
      format = string.format, gmatch = string.gmatch, gsub = string.gsub,
      len = string.len, lower = string.lower, match = string.match,
      rep = string.rep, reverse = string.reverse, sub = string.sub,
      upper = string.upper },
  table = { insert = table.insert, maxn = table.maxn, remove = table.remove,
      sort = table.sort },
  math = { abs = math.abs, acos = math.acos, asin = math.asin,
      atan = math.atan, atan2 = math.atan2, ceil = math.ceil, cos = math.cos,
      cosh = math.cosh, deg = math.deg, exp = math.exp, floor = math.floor,
      fmod = math.fmod, frexp = math.frexp, huge = math.huge,
      ldexp = math.ldexp, log = math.log, log10 = math.log10, max = math.max,
      min = math.min, modf = math.modf, pi = math.pi, pow = math.pow,
      rad = math.rad, random = math.random, sin = math.sin, sinh = math.sinh,
      sqrt = math.sqrt, tan = math.tan, tanh = math.tanh },
  os = { clock = os.clock, difftime = os.difftime, time = os.time },
}

function run_sandbox(code, ...)
    local instr_limit = 1e7
    local instr_count = 0

    local function debug_step()
        instr_count = instr_count + 1
        if instr_count > instr_limit then
            error("Script used too much time")
        end
    end


    local untrusted_fun, message = load(code,nil,'t',sandbox_env)
    if not untrusted_fun then return nil, message end
    debug.sethook(debug_step)
    local stat, res = pcall(untrusted_fun, ...)
    debug.sethook(nil)
    return res, nil
end
return run_sandbox
"#;

    let fun: rlua::Function = lua.load(src).eval()?;
    lua.globals().set("safe_run", fun)?;
    Ok(())
}


fn register_ta(lua: rlua::Context) -> Result<()> {
    let ta = lua.create_table()?;
    ta.set("ema", lua.create_function(|lua, (period, ): (u32, )| {
        Ok(LuaIndicator {
            indicator: ExponentialMovingAverage::new(period).unwrap()
        })
    })?)?;

    ta.set("sma", lua.create_function(|lua, (period, ): (u32, )| {
        Ok(LuaIndicator {
            indicator: SimpleMovingAverage::new(period).unwrap()
        })
    })?)?;

    ta.set("macd", lua.create_function(|lua, (fast, slow, sig): (u32, u32, u32)| {
        Ok(LuaIndicator {
            indicator: MovingAverageConvergenceDivergence::new(fast, slow, sig).unwrap()
        })
    })?)?;
    ta.set("rsi", lua.create_function(|lua, period: u32| {
        Ok(LuaIndicator {
            indicator: ta::indicators::RelativeStrengthIndex::new(period).unwrap()
        })
    })?)?;

    let tr = lua.create_function(|lua, ()| {
        Ok(LuaIndicator {
            indicator: ta::indicators::TrueRange::new()
        })
    })?;
    ta.set("tr", tr)?;

    let atr = lua.create_function(|lua, period: u32| {
        Ok(LuaIndicator {
            indicator: ta::indicators::AverageTrueRange::new(period).unwrap()
        })
    })?;
    ta.set("atr", atr)?;

    let max = lua.create_function(|lua, period: u32| {
        Ok(LuaIndicator {
            indicator: ta::indicators::Maximum::new(period).unwrap()
        })
    })?;
    ta.set("max", max)?;

    let min = lua.create_function(|lua, period: u32| {
        Ok(LuaIndicator {
            indicator: ta::indicators::Minimum::new(period).unwrap()
        })
    })?;
    ta.set("min", min)?;

    let ss = lua.create_function(|lua, (a, b): (u32, u32)| {
        Ok(LuaIndicator {
            indicator: ta::indicators::SlowStochastic::new(a, b).unwrap()
        })
    })?;

    ta.set("ss", ss)?;

    let fs = lua.create_function(|lua, period: u32| {
        Ok(LuaIndicator {
            indicator: ta::indicators::FastStochastic::new(period).unwrap()
        })
    })?;
    ta.set("fs", fs)?;

    lua.globals().set("ta", ta.clone())?;
    Ok(())
}

