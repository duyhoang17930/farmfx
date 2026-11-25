const farm = [
  ["buildings/chicken-coop","Chuồng gà",3,29,{ footprint:[3,2], visual:{ open:true } }],
  ["buildings/greenhouse","Nhà kính",13,29,{ footprint:[3,2] }],
  ["buildings/barn","Nhà kho nông trại",18,29,{ footprint:[3,2], visual:{ open:true } }],
  ["animals/chicken","Gà mái",4,32],
  ["animals/chick","Gà con",6,32,{ visual:{ facing:"right", state:"move" } }],
  ["animals/cow","Bò sữa",4,34,{ visual:{ facing:"right", anim:"graze" } }],
  ["animals/sheep","Cừu",7,34,{ visual:{ facing:"left", anim:"graze" } }],
  ["animals/rabbit","Thỏ",7,36],
  ["animals/duck","Vịt",5,36],
  ["objects/beehive","Tổ ong",3,36,{ footprint:[1,1], visual:{ active:true } }],
  ["animals/bee","Ong mật",4,36],
  ["tools/scarecrow","Bù nhìn",20,34,{ footprint:[1,1] }],
];

const crops = [
  ["crops/carrot","Cà rốt",12,33],
  ["crops/tomatoes","Cà chua",15,33],
  ["crops/wheat","Lúa mì",18,33],
  ["crops/corn","Ngô",12,36],
  ["crops/watermelons","Dưa hấu",15,36],
  ["crops/grapes","Nho",18,36],
].flatMap(([id,name,x,y]) => [
  [id,name,x,y,{ visual:{ stage:2 } }],
  [id,name,x+1,y,{ visual:{ stage:4 } }],
  [id,name,x+2,y,{ visual:{ stage:-1 } }],
]);

const workshop = [
  ["buildings/windmill","Cối xay gió",17,38,{ footprint:[3,3] }],
  ["buildings/market-stall","Quầy hàng",3,39,{ footprint:[3,2] }],
  ["machines/spinning-wheel","Guồng quay sợi",7,39,{ footprint:[2,2], visual:{ active:true } }],
  ["machines/sawmill","Máy cưa gỗ",12,39,{ footprint:[2,2], visual:{ active:true } }],
  ["machines/power-generator","Máy phát điện",13,43,{ footprint:[2,2], visual:{ active:true } }],
  ["machines/anvil","Đe rèn",5,43,{ footprint:[2,2] }],
  ["objects/barrel","Thùng gỗ",3,42,{ footprint:[1,1] }],
  ["objects/crate","Hòm gỗ",8,44,{ footprint:[1,1] }],
  ["tools/lantern","Đèn lồng",9,38],
  ["tiles/fence","Hàng rào",3,45,{ footprint:[1,1], visual:{ facing:"east-west" } }],
  ...[15,16,17,18].map(x => ["machines/conveyor-belt","Băng chuyền",x,44,{ visual:{ facing:"east", active:true } }]),
];

const woodland = [
  ["trees/birch","Bạch dương",4,47,{ footprint:[1,1] }],
  ["trees/willow","Liễu",7,48,{ footprint:[1,1] }],
  ["trees/maple","Phong",18,47,{ footprint:[1,1] }],
  ["trees/fruit-tree","Cây ăn quả",5,51,{ footprint:[1,1], visual:{ fruit:true } }],
  ["trees/crystal-tree","Cây pha lê",17,54,{ footprint:[1,1] }],
  ["animals/fox","Cáo",7,51,{ visual:{ facing:"right", state:"move" } }],
  ["animals/deer","Hươu",17,49,{ visual:{ facing:"left" } }],
  ["animals/frog","Ếch",12,53],
  ["animals/dragonfly","Chuồn chuồn",14,51],
  ["objects/campfire","Lửa trại",6,54,{ footprint:[1,1], visual:{ active:true } }],
];

const pond = Array.from({ length:9 }, (_, i) => {
  const x = i%3, y = Math.floor(i/3);
  const banks = (y===0 ? "N" : "") + (x===2 ? "E" : "") + (y===2 ? "S" : "") + (x===0 ? "W" : "");
  return ["tiles/pond","Ao nhỏ",13+x,50+y,{ footprint:[1,1], ground:true, visual:{ banks } }];
});

export const gardenSections = [
  { id:"farm", title:"Khu nông trại", detail:"Cây trồng, vật nuôi, nhà kính và tổ ong", waypoint:[10,32], firstRow:28 },
  { id:"workshop", title:"Khu xưởng", detail:"Cối xay, quầy hàng và máy đang chạy", waypoint:[10,42], firstRow:38 },
  { id:"woodland", title:"Vườn cây và ao", detail:"Các loài cây, thú hoang, ao nhỏ và lửa trại", waypoint:[10,50], firstRow:46 },
];

export const gardenSamples = [...farm,...crops,...workshop,...woodland,...pond];
export const gardenAssetIds = [...new Set([...gardenSamples.map(([id]) => id),"tiles/dirt-path"])];
