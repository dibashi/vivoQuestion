const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class NodeRed extends cc.Component {

    
    @property(cc.Node)
    leftO = null;
    @property(cc.Node)
    leftX = null;
    @property(cc.Node)
    rightO = null;
    @property(cc.Node)
    rightX = null;
    @property(cc.SpriteFrame)
    whiteSF = null;
    @property(cc.SpriteFrame)
    greenSF = null;
    @property(cc.SpriteFrame)
    redSF = null;

   

    onLoad() {

    }

    start() {
        
    }

  
}