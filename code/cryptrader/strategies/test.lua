local slow = ta.sma(20);
local fast = ta.ema(20);
local macd = ta.macd(1,2,3);
local rsi = ta.rsi(10);

if fast() > slow() then
    return 100
elseif slow() > fast() then
    return -100
else
    return 0
end