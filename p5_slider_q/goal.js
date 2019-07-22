class Goal {
    constructor() {
        this.width = 20;
        this.height = this.width;

        this.x = Math.random() * (+width - this.width);
        this.y = Math.random() * (+height - this.height);

        this.color = "green";
    }

    show() {
        fill(this.color);
        rect(this.x, this.y, this.width, this.height);
    }
}