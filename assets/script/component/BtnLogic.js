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
    @property(cc.SpriteFrame)
    kuangSF = null;

   

    onLoad() {

    }

    start() {
       this.showNormal(); 
    }
    
    //是否显示，颜色， 左O 左X，右O，右X是否显示
    showResult(isShow,color,isShowLeftO,isShowLeftX,isShowRightO,isShowRightX) {
        this.showNormal();    
        if(isShow) {
            this.node.active = true;
        } else {
            this.node.active = false;
            return;
        }

        if(color == "white") {
            this.node.getComponent(cc.Sprite).spriteFrame = this.whiteSF;
        } else if(color == "green") {
            this.node.getComponent(cc.Sprite).spriteFrame = this.greenSF;
        } else if(color == "red") {
            this.node.getComponent(cc.Sprite).spriteFrame = this.redSF;
        }

        if(isShowLeftO) {
            this.leftO.active = true;
        }
        if(isShowLeftX) {
            this.leftX.active = true;
        }
        if(isShowRightO) {
            this.rightO.active = true;
        } 
        if(isShowRightX) {
            this.rightX.active = true;
        }
    }

    showNormal() {
        this.leftO.active = false;
        this.leftX.active = false;
        this.rightO.active = false;
        this.rightX.active = false;
        this.node.getComponent(cc.Sprite).spriteFrame = this.whiteSF;
        this.node.active = true;
    }

  
}