import { Container } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

//define the Spine animation map for the character
//name: animation track key.
//loop: do the animation once or infinitely.
const animationMap = {
    idle: {
        name: 'idle',
        loop: true,
    },
    walk: {
        name: 'walk',
        loop: true,
    },
    run: {
        name: 'run',
        loop: true,
    },
    jump: {
        name: 'jump',
        timeScale: 1.5,
    },
    hover: {
        name: 'hoverboard',
        loop: true,
    },
    spawn: {
        name: 'portal',
    },
};

//class for handling the character Spine and its animations
export class SpineBoy
{
    constructor()
    {
        //the character's state
        this.state = {
            walk: false,
            run: false,
            hover: false,
            jump: false,
        };

        //create the main view.
        this.view = new Container();
        this.directionalView = new Container();

        //create the spine instance using the preloaded Spine asset aliases
        this.spine = Spine.from({
            skeleton: 'spineSkeleton',
            atlas: 'spineAtlas'
        });

        //add the Spine instance to the directional view
        this.directionalView.addChild(this.spine);

        //add the directional view to the main view
        this.view.addChild(this.directionalView);

        //set the default mix duration for all animations
        //this is the duration to blend from the previous animation to the next
        this.spine.state.data.defaultMix = 0.2;
    }

    //play the portal-in spawn animation
    spawn()
    {
        this.spine.state.setAnimation(0, animationMap.spawn.name);
    }

    //play the spine animation
    playAnimation({ name, loop = false, timeScale = 1 })
    {
        //skip if the animation is already playing
        if (this.currentAnimationName === name) return;

        //play the animation on main track instantly
        const trackEntry = this.spine.state.setAnimation(0, name, loop);

        //apply the animation's time scale (speed)
        trackEntry.timeScale = timeScale;
    }

    update()
    {
        //play the jump animation if not already playing
        if (this.state.jump) this.playAnimation(animationMap.jump);

        //skip the rest of the animation updates during the jump animation
        if (this.isAnimationPlaying(animationMap.jump)) return;

        //handle the character animation based on the latest state and in the priority order
        if (this.state.hover) this.playAnimation(animationMap.hover);
        else if (this.state.run) this.playAnimation(animationMap.run);
        else if (this.state.walk) this.playAnimation(animationMap.walk);
        else this.playAnimation(animationMap.idle);
    }

    isSpawning()
    {
        return this.isAnimationPlaying(animationMap.spawn);
    }

    isAnimationPlaying({ name })
    {
        //check if the current animation on main track equals to the queried
        //also check if the animation is still ongoing
        return this.currentAnimationName === name && !this.spine.state.getCurrent(0).isComplete();
    }

    //return the name of the current animation on main track
    get currentAnimationName()
    {
        return this.spine.state.getCurrent(0)?.animation.name;
    }

    //return character's facing direction
    get direction()
    {
        return this.directionalView.scale.x > 0 ? 1 : -1;
    }

    //set character's facing direction
    set direction(value)
    {
        this.directionalView.scale.x = value;
    }
}
