import {fk, many, attr, Model, ORM, createSelector} from 'redux-orm';

export class Strategy extends Model {
    static modelName = "Strategy";
    static fields = {
        id: attr(),
        name: attr(),
        body: attr(),
    }
}

export class Trader extends Model {
    static modelName = "Trader";
    static fields = {
        id: attr(),
        name: attr(),
    }
}

export class Pair extends Model {
    static modelName = "Pair";
    static fields = {
        exchange: attr(),
        pair: attr()
    };
    static options = {
        idAttribute: "pair"
    };

}

export class Period extends Model {
    static modelName = "Period";
    static fields = {
        text: attr()
    }
}

export class Evaluation extends Model {
    static modelName = "Evaluation";
    static fields = {}
}

export class Assignment extends Model {
    static modelName = "Assignment";
    static fields = {
        exchange: attr(),
        pair: attr(),
        period: attr(),
        strategy_id: attr(),
        trader_id: attr()
    };
}

export const orm = new ORM();
orm.register(Strategy, Trader, Pair, Period, Evaluation, Assignment);

const dbStateSelector = state => state.db;

export const allStrategiesSelector = createSelector(
    orm,
    dbStateSelector,
    sess => {
        console.log("Executing states eselector " + sess.accessedModelInstances);
        return sess.Strategy.all().toModelArray()
    }
);

export const getStrategySelector = id => {
    return createSelector(
        orm,
        dbStateSelector,
        sess => {
            return sess.Strategy.withId(id)
        }
    );
};


export default orm;