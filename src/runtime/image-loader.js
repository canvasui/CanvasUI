const ImageLoader = {
    imageNum: 0,
    loadedNum: 0,
    images: {},

    load(component) {
        for (let child of component.children) {
            if (child.tagName === 'image') {
                this.imageNum += 1
                let image = new Image()
                image.src = child.props.path
                this.images[child.props.path] = image
            }
            this.load(child)
        }
    },

    finish(callback) {
        if (Object.keys(this.images).length === 0) {
            callback()
        } else {
            for (let image of Object.values(this.images)) {
                image.onload = () => {
                    this.loadedNum += 1
                    if (this.imageNum === this.loadedNum) {
                        callback()
                    }
                }
            }
        }
    }
}
