import { Container, Sprite, Texture, TilingSprite } from 'pixi.js';

//class for handling the environment
export class Scene
{
    constructor(width, height)
    {
        //create a main view that holds all layers
        this.view = new Container();

        //create the stationary sky that fills the entire screen
        this.sky = Sprite.from('sky');
        this.sky.anchor.set(0, 1);
        this.sky.width = width;
        this.sky.height = height;

        //create textures for the background, mid-ground, and platform
        const backgroundTexture = Texture.from('background');
        const midgroundTexture = Texture.from('midground');
        const platformTexture = Texture.from('platform');

        //calculate the ideal platform height depending on the passed-in screen height
        const maxPlatformHeight = platformTexture.height;
        const platformHeight = Math.min(maxPlatformHeight, height * 0.4);

        //calculate the scale to be apply to all tiling textures for consistency
        const scale = this.scale = platformHeight / maxPlatformHeight;

        const baseOptions = {
            tileScale: { x: scale, y: scale },
            anchor: { x: 0, y: 1 },
            applyAnchorToTexture: true,
        };
        
        //create the tiling sprite layers
        this.background = new TilingSprite({
            texture: backgroundTexture,
            width,
            height: backgroundTexture.height * scale,
            ...baseOptions,
        });
        this.midground = new TilingSprite({
            texture: midgroundTexture,
            width,
            height: midgroundTexture.height * scale,
            ...baseOptions,
        });
        this.platform = new TilingSprite({
            texture: platformTexture,
            width,
            height: platformHeight,
            ...baseOptions,
        });

        //calculate the floor height for external referencing
        this.floorHeight = platformHeight * 0.43;

        //position the backdrop layers
        this.background.y = this.midground.y = -this.floorHeight;

        //add all layers to the main view
        this.view.addChild(this.sky, this.background, this.midground, this.platform);
    }

    //гse the platform's horizontal position as the key position for the scene.
    get positionX()
    {
        return this.platform.tilePosition.x;
    }

    //ыet the horizontal position of the platform layer while applying parallax scrolling to the backdrop layers
    set positionX(value)
    {
        this.background.tilePosition.x = value * 0.1;
        this.midground.tilePosition.x = value * 0.25;
        this.platform.tilePosition.x = value;
    }
}
