// target map keep it high
var targetMap = new WeakMap();
// introduce activeEffect
var activeEffect = null;
function effect(eff) {
    activeEffect = eff;
    activeEffect();
    activeEffect = null;
}

// base consts
const BASE_CLASS_HP = 15;
const BASE_CLASS_SPEED = 20;

// dynamic modifier
var modifierPerLevel = ref(1.3);

// defining reactive object
var character = reactive({
    level: 0,
    HP: 0,
    speed: 0
});

// initial test suit
testSuitInitial();

// important to register effect for the first time so that all system start working
var charHP = computed(
    () =>
        (character.HP =
            BASE_CLASS_HP + character.level * modifierPerLevel.value)
);
var charSpeed = computed(
    () =>
        (character.speed =
            BASE_CLASS_SPEED + character.level * -modifierPerLevel.value)
);

character.diceCase = dice();

// set of notifying effects
effect(() =>
    console.log(
        `%c🎲 Dice case is ${character.diceCase}`,
        'background: #222; color: lime'
    )
);

effect(() => {
    console.log(
        `❤ ${character.HP} %c HP auto updated`,
        'background: #222; color: tomato'
    );
});

effect(() => {
    console.log(
        `⚡️ ${character.speed} %c speed auto updated`,
        'background: #222; color: #ffff00'
    );
});

effect(() => {
    console.log(
        `✨ ${character.level} %c level up`,
        'background: #222; color: #bada55'
    );
});
// set of notifying effects end

character.diceCase = dice();

// test suit after effects registered
testSuitEffectsRegistered();

character.level = 1;
// level up test suit
testSuitLevelUp();

modifierPerLevel.value = 1.4;
character.diceCase = dice();

// reactive ref modifier updated test suit
testSuitModifierRefUpdated();

//**************************/

function track(target, key) {
    if (activeEffect) {
        var depMap = targetMap.get(target);

        if (!depMap) {
            targetMap.set(target, (depMap = new Map()));
        }

        var dep = depMap.get(key);

        if (!dep) {
            depMap.set(key, (dep = new Set()));
        }

        dep.add(activeEffect);
    }
}

function trigger(target, key) {
    var depMap = targetMap.get(target);

    if (!depMap) {
        return;
    }

    var dep = depMap.get(key);

    if (dep) {
        dep.forEach(d => d());
    }
}

function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);

            track(target, key);

            return res;
        },
        set(target, key, value, receiver) {
            const oldVal = target[key];
            const res = Reflect.set(target, key, value, receiver);

            if (oldVal != res) {
                trigger(target, key);
            }

            return res;
        }
    };

    return new Proxy(target, handler);
}

function ref(raw) {
    var r = {
        get value() {
            track(r, 'value');
            return raw;
        },
        set value(newVal) {
            raw = newVal;
            trigger(r, 'value');
        }
    };
    return r;
}

function computed(getter) {
    var res = ref();

    effect(() => (res.value = getter()));

    return res;
}

function testSuitInitial() {
    console.log(
        `%c /***************** Initial test suit: expect initial variables values log`,
        'background: #222; color: #fff'
    );
    console.log(`%c ⚙️ input`, 'background: #222; color: orange');

    console.log(
        `modifierPerLevel — %c ${modifierPerLevel.value}`,
        'background: #222; color: #c00'
    );
    console.log(
        `BASE_CLASS_HP — %c ${BASE_CLASS_HP}`,
        'background: #222; color: #c00'
    );
    console.log(
        `BASE_CLASS_SPEED — %c ${BASE_CLASS_SPEED}`,
        'background: #222; color: #c00'
    );
    console.log(
        `character.HP — %c ${character.HP} (should be 0)`,
        'background: #222; color: #bada55'
    );
    console.log(
        `character.speed — %c ${character.speed} (should be 0)`,
        'background: #222; color: #bada55'
    );
    console.log(`%c *****************/`, 'background: #222; color: #fff');
}

function testSuitEffectsRegistered() {
    console.log(
        `%c /***************** Effects registered test suit: expect character get initial stats`,
        'background: #222; color: #fff'
    );
    console.log(
        `charHP — %c ${charHP.value} (should be 15)`,
        'background: #222; color: #bada55'
    );
    console.log(
        `charSpeed — %c ${charSpeed.value} (should be 20)`,
        'background: #222; color: #bada55'
    );
    console.log(`%c *****************/`, 'background: #222; color: #fff');
}

function testSuitModifierRefUpdated() {
    console.log(
        `%c /***************** Modifier ref updated test suit: expect charHP and charSpeed to be set to new values`,
        'background: #222; color: #fff'
    );
    console.log(
        `%c modifierPerLevel changed to ${modifierPerLevel.value}`,
        'background: #222; color: orange'
    );

    console.log(
        `charHP — %c ${charHP.value} (should be 16.4)`,
        'background: #222; color: #bada55'
    );
    console.log(
        `charSpeed — %c ${charSpeed.value} (should be 18.6)`,
        'background: #222; color: #bada55'
    );
    console.log(`%c *****************/`, 'background: #222; color: #fff');
}

function testSuitLevelUp() {
    console.log(
        `%c /***************** Level up test suit: expect charHP and charSpeed to be set to new values`,
        'background: #222; color: #fff'
    );
    console.log(
        `%c gain level ${character.level}`,
        'background: #222; color: orange'
    );
    console.log(
        `charHP — %c ${charHP.value} (should be 16.3)`,
        'background: #222; color: #bada55'
    );
    console.log(
        `charSpeed — %c ${charSpeed.value} (should be 18.7)`,
        'background: #222; color: #bada55'
    );
    console.log(`%c *****************/`, 'background: #222; color: #fff');
}

function dice() {
    return Math.floor(Math.random() * 12 + 1);
}
