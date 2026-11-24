import { ramp } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

const CRUST = ramp(["#533440","#8c4c38","#bd733f","#dfa85c","#ffda94"]);
const BAKED = ramp(["#4e3541","#734836","#9f623e","#c98c58","#edba7f"]);
const AMBER = ramp(["#673a42","#9e4c3f","#cc653d","#f29548","#ffe097"]);
const CERAMIC = ramp(["#38354b","#544d66","#7f7790","#b6a8bc","#ece1d9"]);
const PLUM = ramp(["#472941","#69314e","#a04369","#d26e91","#ffbec2"]);
const NORI = ramp(["#25363a","#354d48","#476751","#728860","#b0c28d"]);

function bowl(p,x,y,C,food) {
  poly(p,x,y,[[-5,-1],[5,-1],[4,2],[2,4],[-2,4],[-4,2]],C[0]);
  poly(p,x,y,[[-4,0],[4,0],[3,2],[1,3],[-2,3],[-3,2]],C[2]);
  p.ellipse(x,y-1,5.15,2.65,C[0]);
  p.ellipse(x,y-1.3,4.45,1.9,food);
  p.line(x-2,y+2,x,y+2,C[3]);
  p.px(x-4,y-2,C[4]);
}

function cup(p,x,y,C,drink) {
  p.ellipse(x+3,y+1,2.4,2.4,C[0]);
  p.ellipse(x+3,y+1,1.3,1.25,C[2]);
  poly(p,x,y,[[-5,-2],[3,-2],[3,1],[2,4],[-3,4],[-4,3]],C[0]);
  poly(p,x,y,[[-4,-1],[2,-1],[2,1],[1,3],[-3,3]],C[2]);
  p.ellipse(x-1,y-2,4,2.05,C[3]);
  p.ellipse(x-1,y-2,3.1,1.3,drink);
  p.line(x-3,y,x-3,y+2,C[4]);
}

function grill(p,x,y,C) {
  for(const [dx,dy] of [[-2,0],[0,-1],[2,-2]])p.line(x+dx,y+dy,x+dx+1,y+dy+2,C[1]);
}

const items = {
  bread: ["A golden loaf with scored crust and a pale cut end.",CRUST,(p,x,y,C)=>{
    poly(p,x,y,[[-5,0],[-3,-3],[0,-4],[3,-4],[5,-2],[5,1],[2,4],[-2,4],[-5,3]],C[0]);
    poly(p,x,y,[[-4,0],[-2,-2],[0,-3],[3,-3],[4,-2],[4,0],[2,2],[-2,3],[-4,2]],C[3]);
    p.line(x-3,y-1,x-1,y-2,C[4]);
    p.line(x-1,y-2,x,y,C[2]);
    p.line(x+2,y-3,x+2,y-1,C[2]);
    p.ellipse(x-3,y+1,1.55,1.75,CREAM[3]);
    p.px(x-3,y,CREAM[4]);
  }],
  toast: ["A browned bread slice with a dark crust and toasted crumbs.",BAKED,(p,x,y,C)=>{
    poly(p,x,y,[[-4,-4],[-2,-5],[3,-4],[5,-2],[4,0],[3,4],[1,5],[-5,3],[-4,-1]],C[0]);
    poly(p,x,y,[[-3,-3],[-1,-4],[3,-3],[4,-2],[3,0],[2,3],[0,4],[-4,2],[-3,-1]],C[3]);
    p.line(x-2,y-3,x+2,y-2,C[4]);
    for(const [dx,dy] of [[-2,1],[0,-1],[1,2],[2,0]])p.px(x+dx,y+dy,C[1]);
  }],
  sandwich: ["A triangular sandwich with green lettuce and red filling between two bread slices.",CRUST,(p,x,y,C)=>{
    poly(p,x,y,[[-5,1],[0,-5],[5,0],[5,2],[1,5],[-4,4]],C[0]);
    poly(p,x,y,[[-4,1],[0,-4],[4,0],[1,2]],CREAM[4]);
    p.polyline([[x-4,y+1],[x-1,y+2],[x+1,y+3],[x+4,y+1]],LEAF[3]);
    p.line(x-2,y+3,x+1,y+4,RED[3]);
    p.line(x+1,y+4,x+4,y+2,C[3]);
    p.px(x,y-1,C[4]);
  }],
  salad: ["Leafy greens and tomato pieces piled on a cool ceramic plate.",LEAF,(p,x,y,C)=>{
    p.ellipse(x,y+1,5.2,3.7,CERAMIC[1]);
    p.ellipse(x,y+0.5,4.7,3,CERAMIC[3]);
    for(const [dx,dy] of [[-3,0],[2,0],[0,-2],[-1,1],[2,-1]])round(p,x+dx,y+dy,1.95,1.8,C);
    p.px(x-1,y,RED[4]);
    p.px(x+2,y+1,RED[3]);
    p.line(x-4,y+2,x-3,y+3,CERAMIC[4]);
  }],
  soup: ["An orange broth with a pale swirl in a blue bowl.",WATER,(p,x,y,C)=>{
    bowl(p,x,y+1,C,AMBER[3]);
    p.polyline([[x-2,y],[x,y-1],[x+2,y],[x+1,y+1]],AMBER[4]);
    p.px(x-1,y-3,CREAM[3]);
    p.px(x,y-4,CREAM[2]);
  }],
  "vegetable-stew": ["A wide earthenware bowl of brown stew with carrot and green vegetable pieces.",WOOD,(p,x,y,C)=>{
    bowl(p,x,y+1,C,C[1]);
    p.rect(x-3,y,2,2,AMBER[3]);
    p.px(x+1,y-1,LEAF[4]);
    p.px(x+2,y,LEAF[3]);
    p.px(x,y+1,CREAM[3]);
    p.line(x+1,y+3,x+2,y+3,C[4]);
  }],
  "cooked-fish": ["A roasted golden fish with a fan tail and dark grill marks.",BAKED,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-3],[-3,-1],[-1,-3],[2,-4],[5,-2],[5,1],[2,3],[-2,3],[-3,2],[-5,4]],C[0]);
    poly(p,x,y,[[-5,-2],[-3,0],[-5,3]],C[2]);
    poly(p,x,y,[[-3,0],[-1,-2],[2,-3],[4,-2],[4,0],[2,2],[-2,2]],C[3]);
    grill(p,x,y,C);
    p.px(x+3,y-1,C[0]);
    p.px(x-4,y,C[4]);
    p.line(x-1,y+3,x+2,y+2,LEAF[3]);
  }],
  "cooked-meat": ["A browned steak with a caramelized rim and short grill marks.",BAKED,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[-2,-4],[2,-3],[5,-1],[5,2],[2,4],[-3,5],[-5,2]],C[0]);
    poly(p,x,y,[[-4,-2],[-2,-3],[2,-2],[4,-1],[4,2],[1,3],[-3,4],[-4,2]],C[2]);
    p.line(x-3,y-2,x-1,y-3,C[4]);
    p.line(x+1,y+3,x+3,y+2,C[3]);
    grill(p,x,y,C);
  }],
  "fried-egg": ["A sunny-side-up egg with a golden yolk and an irregular white edge.",CREAM,(p,x,y,C)=>{
    poly(p,x,y,[[-5,0],[-4,-2],[-2,-3],[1,-3],[3,-4],[5,-2],[5,2],[3,4],[0,5],[-4,3]],C[1]);
    poly(p,x,y,[[-4,0],[-3,-2],[-2,-2],[1,-2],[3,-3],[4,-2],[4,2],[2,3],[0,4],[-3,2]],C[4]);
    round(p,x+0.6,y,2.5,2.45,GOLD);
    p.px(x,y-1,GOLD[4]);
  }],
  omelette: ["A folded golden omelette with a browned edge and chopped herbs.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-5,1],[-3,-2],[0,-4],[3,-4],[5,-2],[5,0],[2,3],[-2,5],[-4,4]],C[0]);
    poly(p,x,y,[[-4,1],[-2,-2],[1,-3],[3,-3],[4,-2],[3,0],[1,2],[-2,4],[-3,3]],C[3]);
    p.line(x-3,y+2,x+3,y-1,C[4]);
    p.line(x-2,y+3,x+1,y+2,C[1]);
    p.px(x-1,y-1,LEAF[2]);
    p.px(x+2,y-2,LEAF[3]);
  }],
  "rice-bowl": ["A blue bowl heaped with white rice and a small herb garnish.",WATER,(p,x,y,C)=>{
    bowl(p,x,y+1,C,CREAM[2]);
    poly(p,x,y,[[-4,0],[-3,-2],[-1,-3],[1,-4],[3,-3],[4,-1],[4,0],[2,1],[-3,1]],CREAM[4]);
    p.line(x-2,y,x+2,y,CREAM[3]);
    p.px(x+1,y-2,LEAF[3]);
    p.line(x-2,y+3,x+2,y+3,C[4]);
  }],
  sushi: ["Two rice rolls edged in dark seaweed with salmon centers.",NORI,(p,x,y,C)=>{
    for(const [dx,dy] of [[2,-2],[-2,1]]) {
      p.rect(x+dx-2,y+dy,5,3,C[0]);
      p.ellipse(x+dx,y+dy+2,2.5,1.5,C[1]);
      p.ellipse(x+dx,y+dy,2.65,2.25,C[0]);
      p.ellipse(x+dx,y+dy,1.95,1.6,CREAM[4]);
      p.px(x+dx,y+dy,AMBER[3]);
    }
  }],
  cake: ["A layer-cake slice with pink filling, icing and a red topping.",PLUM,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[1,-5],[5,-1],[5,3],[-3,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,-2],[1,-4],[4,-1],[-3,1]],CREAM[4]);
    poly(p,x,y,[[-4,0],[-3,1],[4,0],[4,2],[-3,4],[-4,3]],C[3]);
    p.line(x-3,y+2,x+4,y+1,CRUST[3]);
    p.px(x+1,y-4,RED[3]);
    p.px(x+1,y-5,RED[4]);
  }],
  pie: ["A small golden pie with a crimped crust and three scored vents.",CRUST,(p,x,y,C)=>{
    p.ellipse(x,y+1,5.25,3.6,C[0]);
    p.ellipse(x,y,5.05,3.15,C[2]);
    p.ellipse(x-0.15,y-0.45,4.15,2.5,C[3]);
    p.line(x-3,y-1,x-1,y-2,C[4]);
    for(const [dx,dy] of [[-2,0],[0,-1],[2,0]])p.line(x+dx,y+dy,x+dx+1,y+dy+1,C[1]);
    p.line(x-2,y+3,x+2,y+3,C[4]);
  }],
  cookie: ["A round golden cookie with dark chocolate chips.",CRUST,(p,x,y,C)=>{
    round(p,x,y,5.1,4.75,C);
    for(const [dx,dy] of [[-2,-2],[1,-2],[-3,1],[0,0],[2,2],[-1,3]])p.px(x+dx,y+dy,C[0]);
    p.px(x+1,y+1,C[4]);
  }],
  jam: ["A small jar of purple berry jam with a cloth cap and a cream label.",PLUM,(p,x,y,C)=>{
    poly(p,x,y,[[-3,-5],[3,-5],[4,-3],[3,-2],[4,0],[4,4],[-4,4],[-4,0],[-3,-2],[-4,-3]],C[0]);
    p.rect(x-3,y-5,7,3,CREAM[3]);
    p.line(x-3,y-5,x+3,y-5,CREAM[4]);
    p.rect(x-3,y-1,6,4,C[2]);
    p.rect(x-2,y,5,2,CREAM[3]);
    p.px(x,y,C[3]);
  }],
  juice: ["A tall glass of orange juice with a bent blue straw.",AMBER,(p,x,y,C)=>{
    p.polyline([[x+1,y],[x+2,y-5],[x+4,y-5]],WATER[4]);
    poly(p,x,y,[[-4,-3],[4,-3],[3,4],[2,5],[-2,5],[-3,3]],STEEL[1]);
    poly(p,x,y,[[-3,-1],[3,-1],[2,4],[-2,4]],C[3]);
    p.line(x-3,y-2,x+3,y-2,CREAM[4]);
    p.line(x-2,y,x-2,y+3,C[4]);
    p.px(x+1,y+2,C[2]);
  }],
  tea: ["A light green teacup holding brewed tea, with a tiny leaf beside it.",LEAF,(p,x,y,C)=>{
    cup(p,x,y,C,WOOD[3]);
    p.line(x-2,y+4,x+2,y+4,C[3]);
    p.line(x+2,y-4,x+4,y-5,C[4]);
    p.px(x+3,y-4,C[2]);
  }],
  coffee: ["A warm stoneware cup of dark coffee with a pale steam curl.",CERAMIC,(p,x,y,C)=>{
    cup(p,x,y+1,C,WOOD[0]);
    p.px(x-2,y-1,WOOD[3]);
    p.polyline([[x,y-3],[x+1,y-4],[x,y-5]],CREAM[4]);
  }],
  "cheese-pizza": ["A triangular pizza slice with a thick crust and melted cheese.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-4],[0,-5],[5,-2],[4,0],[-3,5],[-4,2]],CRUST[0]);
    poly(p,x,y,[[-4,-3],[0,-4],[4,-2],[2,0],[-3,4]],C[3]);
    p.polyline([[x-4,y-3],[x,y-4],[x+3,y-2]],CRUST[3]);
    p.line(x-2,y-1,x-2,y+2,C[4]);
    p.px(x+1,y-1,C[2]);
    p.px(x-1,y+1,AMBER[2]);
  }],
  burger: ["A sesame bun stacked over lettuce, cheese and a dark patty.",CRUST,(p,x,y,C)=>{
    p.ellipse(x,y+2,5.15,2.5,C[0]);
    p.ellipse(x,y+2,4.55,1.9,C[3]);
    p.line(x-4,y+1,x+4,y+1,WOOD[0]);
    p.line(x-4,y,x+4,y,LEAF[3]);
    p.px(x+1,y+1,GOLD[4]);
    poly(p,x,y,[[-5,-1],[-4,-3],[-2,-4],[2,-4],[4,-3],[5,-1],[3,0],[-3,0]],C[0]);
    poly(p,x,y,[[-4,-1],[-3,-3],[-1,-3],[2,-3],[4,-1],[2,0],[-3,0]],C[3]);
    p.px(x-2,y-2,C[4]);
    p.px(x+1,y-2,C[4]);
  }],
  "roasted-potato": ["A baked potato split open to show a pale center and butter.",BAKED,(p,x,y,C)=>{
    round(p,x,y+1,5.15,4.1,C);
    poly(p,x,y,[[-4,-1],[-1,-3],[0,-1],[3,-2],[4,0],[2,2],[-2,3],[-3,1]],CREAM[3]);
    p.line(x-2,y,x+1,y+1,CREAM[4]);
    p.rect(x,y-1,2,2,GOLD[3]);
    p.px(x+1,y-1,GOLD[4]);
  }],
  "grilled-corn": ["A golden cob with char marks and a short toasted stem.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-4,1],[-3,-1],[1,-5],[4,-4],[5,-2],[3,1],[-1,4],[-4,4]],CRUST[0]);
    poly(p,x,y,[[-3,1],[-2,-1],[1,-4],[3,-3],[4,-2],[2,0],[-1,3],[-3,3]],C[3]);
    p.line(x-2,y,x+1,y-3,C[4]);
    for(const [dx,dy] of [[-2,1],[0,-1],[2,-3]])p.line(x+dx,y+dy,x+dx+1,y+dy+1,BAKED[2]);
    p.px(x,y+1,C[4]);
    p.line(x-4,y+4,x-2,y+3,WOOD[3]);
  }],
  "fruit-bowl": ["A clay bowl topped with red, yellow and purple fruit.",CRUST,(p,x,y,C)=>{
    bowl(p,x,y+1,C,C[0]);
    round(p,x-2.35,y-1.2,2.4,2.4,RED);
    round(p,x+2.15,y-1.4,2.45,2.45,GOLD);
    round(p,x,y-2.2,1.8,1.85,VIOLET);
    p.line(x-3,y-3,x-2,y-4,LEAF[3]);
    p.line(x-2,y+3,x+2,y+3,C[4]);
  }],
  "mushroom-soup": ["Creamy mushroom soup in a violet bowl with a mushroom slice on top.",CERAMIC,(p,x,y,C)=>{
    bowl(p,x,y+1,C,CREAM[3]);
    p.ellipse(x-1,y-1,2.6,1.55,WOOD[2]);
    p.line(x-3,y-1,x,y-2,CREAM[4]);
    p.line(x-1,y,x-1,y+1,CREAM[4]);
    p.px(x+2,y,WOOD[3]);
  }],
};

export const {item:foodItem,drawIcon:drawFoodIcon} = inventoryItems("food",items);
