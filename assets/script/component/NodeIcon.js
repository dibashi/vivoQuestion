const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class NodeIcon extends cc.Component {

    onLoad() {

    }

    start() {

    }

    initIcon(url) {
        let imageUrl = url;
        if (imageUrl) {
            //console.log("-- 网络图片 -- " + imageUrl);
            //更改图片
            let self = this;
            cc.loader.load(imageUrl, function (err, texture) {
                //console.log("-- 加载图片返回了 --")
                //console.log(err);
                if (texture && self.node) {
                    self.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }
    }
}