import { Container } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

//class for handling the character Spine and its animations
export class SpineBoy
{
    constructor()
    {
        //create the main view.
        this.view = new Container();

        //create the spine instance using the preloaded Spine asset aliases
        this.spine = Spine.from({
            skeleton: 'spineSkeleton',
            atlas: 'spineAtlas'
        });

        //add the spine to a main view
        this.view.addChild(this.spine);
    }
}
