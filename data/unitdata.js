const Time = require('../utility/time');

exports.Unit = {
    Infantry: {
        1: {
            Hitpoints: 15,
            Speed: 36,
            ViewRange: 42,
            AttackRange: 0,
            Strength: {
                Attack: {
                    Unarmored: 3.0,
                    Light: 1.5,
                    Heavy: 1.0,
                    Air: 1.0,
                    Ship: 0.5,
                    Sub: 0.5,
                    Building: 0.2,
                    Morale: 0.1
                },
                Defence: {
                    Unarmored: 4.5,
                    Light: 2.3,
                    Heavy: 1.5,
                    Air: 1.5,
                    Ship: 0.8,
                    Sub: 0.8,
                    Building: 0.3
                }
            },
            Cost: {
                Production: {
                    Food: 0,
                    Goods: 0,
                    Metal: 0,
                    Oil: 0,
                    Rare: 0,
                    Manpower: 0,
                    Money: 0,
                    Time: new Time(0)
                },
                Upkeep: {
                    Food: 0,
                    Goods: 0,
                    Metal: 0,
                    Oil: 0,
                    Rare: 0,
                    Manpower: 0,
                    Money: 0,
                },
                Research: {
                    Food: 0,
                    Goods: 0,
                    Metal: 0,
                    Oil: 0,
                    Rare: 0,
                    Money: 0,
                    Time: new Time(0,2,30,0)
                }
            }
        }
    }
}