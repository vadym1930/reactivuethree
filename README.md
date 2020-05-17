# [Reacti(v]ue)3 🤺

Documented Vue 3 reactivity system essentials.

---

> Motivation: knowing how things are working under the hood makes technology
> or library easier to grasp and to work with, it's removing spells, but adding charms.
> -- Anyone Wise

<br>

### Did the course by [vuemastery](https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity) and fixed the results here in the repo.

### Go to deployed [web version.](https://morning-meadow-98823.herokuapp.com/)

### See implementation:

-   [Reactivity from scratch.](src/reactivuetythree/index.js)
-   [Debugging insights](/src/reactivuetythree/debuggin.html)
    (open the debuggin.html, open console and reload, observe breakpoint `e` variable).

### See visual [schema.](https://www.plectica.com/maps/126WN3ECA)

### Take away points:

1. Vue 3 reactivity is a separate package which can be used standalone.
2. There are a few methods exposing by the package, all that four, but
   simplified methods versions were rebuilt from scratch during the course:

    - `computed`
    - `effect`
    - `reactive`
    - `ref`

3. The hierarchy of reactivity system represents by 🎯`targetMap` for storing
   the reactive objects as a keys and 🏢`depMap` as a value, where key is
   a reactive property string name and value is a `depSet`🏃 of effects should
   rerun on property change. (Visual schema attached above).

<br>

---

PS. Enjoyed learning a lot.
Thanks vuemastery team for doing a great job unblackboxing the Vue.js.

Also checked out wallabyjs.quokka-vscode extension — the one
is allowing the console.log preview while you are typing — yeees, very cool.

---
