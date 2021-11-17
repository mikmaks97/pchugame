# pchugame
A 2-player co-op infinite vertical scroller with a player control twist that encourages coordination and chemistry

--- 

Pchu is a browser game, whose protagonists are two complementary edgy creatures, lovingly named pchus after the sound they evoke. Like their archetypes Yin and Yang there is a bit of one pchu inside the other, and, hence, they need each other to survive the blocky world they’re in. Controlled by two well coordinated players, these creatures jump on colorful blocks and shoot to explode their circular foes in order to reach the edge of the universe. But the chemistry of the players determines the fate of the little pchus.

This project is an experiment in player control, where players control aspects of each other’s abilities, specifically each others' jump and shoot, to guide their pchus ever higher in the infinite vertical scroll.

Try it out at [https://mikmaks97.github.io/pchugame](https://mikmaks97.github.io/pchugame).

## Explore the code
This project is built with [Phaser](https://phaser.io).

1. Clone the repository.
2. `index.html` is the entry file and contains the Phaser engine initialization.
3. `js/` contains all of the game logic (that runs in this order):
    - `boot.js`: primary boot script invoked by the Phaser engine that starts the `preload` process
    - `preload.js`: loads all image and sound assets required by the game and starts the `main` process
    - `main.js`: core game loop; transitions to `gameover` on death
    - `gameover.js` save score to browser storage and reset game state
