export class ContentOptions {
  public x: number;
  public y: number;
  public width: number;
  public content: string;

  constructor(x, y, width, content) {
    this.x = x;
    this.y = y;
    this.width = width || 1;
    this.content = content || '';
  }
}
