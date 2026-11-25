const farm = [
  ["buildings/coastal-farmstead","Chuồng gà",3,29,{ footprint:[3,3], visual:{ style:"coop" } }],
  ["buildings/coastal-farmstead","Nhà kính",12,29,{ footprint:[4,3], visual:{ style:"greenhouse" } }],
  ["buildings/coastal-farmstead","Chuồng bò",17,29,{ footprint:[4,3], visual:{ style:"barn" } }],
  ["animals/coastal-livestock","Gà mái",4,32,{ visual:{ species:"chicken",feed:true } }],
  ["animals/coastal-livestock","Gà con",6,32,{ visual:{ species:"chick",feed:true } }],
  ["animals/coastal-livestock","Bò sữa",4,34,{ visual:{ species:"cow",feed:true } }],
  ["animals/coastal-livestock","Cừu",7,34,{ visual:{ species:"sheep",facing:"left",feed:true } }],
  ["animals/coastal-livestock","Bê con",4,35,{visual:{species:"calf",feed:true}}],
  ["animals/coastal-livestock","Cừu con",8,35,{visual:{species:"lamb",facing:"left"}}],
  ["animals/coastal-livestock","Thỏ",7,36,{ visual:{ species:"rabbit" } }],
  ["animals/coastal-livestock","Vịt",5,36,{ visual:{ species:"duck",feed:true } }],
  ["objects/beehive","Tổ ong",3,36,{ footprint:[1,1], visual:{ active:true } }],
  ["animals/bee","Ong mật",4,36],
  ["tools/scarecrow","Bù nhìn",20,34,{ footprint:[1,1] }],
  ["objects/feeding-trough","Máng ăn",8,33,{ footprint:[1,1] }],
];

const crops = [
  ["carrot","Cà rốt",12,33],
  ["tomato","Cà chua",15,33],
  ["wheat","Lúa mì",18,33],
  ["corn","Ngô",12,36],
  ["melon","Dưa hấu",15,36],
  ["grape","Nho",18,36],
  ["rice","Lúa",13,68],
  ["cabbage","Bắp cải",16,68],
  ["pepper","Ớt ngọt",11,85],
  ["turnip","Củ cải",14,85],
  ["bean","Đậu leo",17,85],
].flatMap(([crop,name,x,y]) => [2,4,-1].map((stage,i) =>
  ["crops/coastal-crop",name,x+i,y,{visual:{crop,stage}}]));

const field = [[33,12,9],[36,12,9],[68,13,6],[85,11,9]].flatMap(([row,start,length]) => {
  return Array.from({length},(_,i)=>["tiles/coastal-field",row===33?"Đất khô":"Đất ướt",start+i,row,{
    ground:true, visual:{joins:i===0?"E":i===length-1?"W":"EW",wet:row!==33,seed:17},
  }]);
});

const workshop = [
  ["buildings/windmill","Cối xay gió",17,38,{ footprint:[3,3] }],
  ["buildings/market-stall","Quầy hàng",3,39,{ footprint:[3,2] }],
  ["machines/coastal-workshop","Guồng quay sợi",7,39,{ footprint:[2,2], visual:{ machine:"spinner" } }],
  ["machines/coastal-workshop","Máy cưa gỗ",12,39,{ footprint:[2,2], visual:{ machine:"saw" } }],
  ["machines/coastal-workshop","Máy phát điện",13,43,{ footprint:[2,2], visual:{ machine:"generator" } }],
  ["machines/coastal-workshop","Đe rèn",5,43,{ footprint:[2,2], visual:{ machine:"anvil" } }],
  ["objects/barrel","Thùng gỗ",3,42,{ footprint:[1,1] }],
  ["objects/crate","Hòm gỗ",8,44,{ footprint:[1,1] }],
  ["tools/lantern","Đèn lồng",9,38],
  ["tiles/fence","Hàng rào",3,45,{ footprint:[1,1], visual:{ facing:"east-west" } }],
  ["machines/coastal-workshop","Máy bơm nước",19,42,{footprint:[1,1],visual:{machine:"pump"}}],
  ...[15,16,17,18].map(x => ["machines/coastal-workshop","Băng chuyền",x,44,{ visual:{ machine:"belt" } }]),
];

const woodland = [
  ["trees/birch","Bạch dương",4,47,{ footprint:[1,1] }],
  ["trees/willow","Liễu",7,48,{ footprint:[1,1] }],
  ["trees/maple","Phong",18,47,{ footprint:[1,1] }],
  ["trees/fruit-tree","Cây ăn quả",5,51,{ footprint:[1,1], visual:{ fruit:true } }],
  ["trees/crystal-tree","Cây pha lê",17,54,{ footprint:[1,1] }],
  ["animals/coastal-livestock","Cáo",7,51,{ visual:{ species:"fox" } }],
  ["animals/coastal-livestock","Hươu",17,49,{ visual:{ species:"deer",facing:"left" } }],
  ["animals/frog","Ếch",12,53,{ visual:{ lily:false } }],
  ["animals/dragonfly","Chuồn chuồn",14,51],
  ["objects/campfire","Lửa trại",6,54,{ footprint:[1,1], visual:{ active:true } }],
];

const pondCells = [[14,49],[15,49],[13,50],[14,50],[15,50],[16,50],[12,51],[13,51],[14,51],[15,51],
  [16,51],[12,52],[13,52],[14,52],[15,52],[13,53],[14,53]];
const pondAt = (x,y) => pondCells.some(([a,b])=>a===x&&b===y);
const sides = [[0,-1,"N"],[1,0,"E"],[0,1,"S"],[-1,0,"W"]];
const diagonals = ["NE","SE","SW","NW"];
const pond = pondCells.map(([x,y]) => {
  const banks = sides.filter(([dx,dy])=>!pondAt(x+dx,y+dy)).map(([, ,dir])=>dir).join("");
  const corners = sides.flatMap(([dx,dy,dir],i)=>{
    const [ax,ay,other]=sides[(i+1)%4];
    return !banks.includes(dir)&&!banks.includes(other)&&!pondAt(x+dx+ax,y+dy+ay)?[diagonals[i]]:[];
  });
  return ["tiles/coastal-pond","Ao nhỏ",x,y,{ footprint:[1,1], ground:true, visual:{ banks,corners,seed:19 } }];
});

const coast = [
  ["buildings/fishing-hut","Nhà câu cá",5,59,{footprint:[4,3]}],
  ["buildings/lumber-house","Nhà mộc",13,59,{footprint:[4,3]}],
  ["objects/notice-board","Bảng thông báo",9,57,{footprint:[1,1]}],
  ["objects/street-lamp","Đèn đường",9,62,{footprint:[1,1]}],
  ["objects/coastal-supplies","Chồng gỗ",18,62,{footprint:[1,1],visual:{object:"logs"}}],
  ["objects/coastal-supplies","Thùng vật liệu",18,65,{footprint:[1,1],visual:{object:"crate"}}],
  ["objects/coastal-supplies","Thùng gửi hàng",17,66,{footprint:[1,1],visual:{object:"bin"}}],
  ["objects/coastal-supplies","Xe cút kít",6,69,{footprint:[1,1],visual:{object:"cart"}}],
  ["objects/hay-bale","Kiện cỏ khô",6,63,{footprint:[1,1]}],
  ["objects/mailbox","Hộp thư",8,63,{footprint:[1,1]}],
  ["objects/coastal-supplies","Chậu hoa",12,61,{footprint:[1,1],visual:{object:"pot"}}],
  ["resources/seashell","Vỏ sò",4,65],
  ["objects/coastal-supplies","Mỏ đất sét",13,64,{footprint:[1,1],visual:{object:"clay"}}],
  ["objects/coastal-supplies","Mỏ muối",17,64,{footprint:[1,1],visual:{object:"salt"}}],
  ["exploration/boat","Thuyền",21,67,{water:true}],
  ["exploration/fishing-spot","Điểm câu cá",2,67,{water:true}],
  ["animals/crab","Cua",4,67],
  ["animals/lobster","Tôm hùm",21,68,{water:true}],
  ["animals/fish","Cá ven biển",2,68,{water:true}],
  ["animals/coastal-livestock","Heo",6,65,{visual:{species:"pig",feed:true}}],
  ["animals/coastal-livestock","Dê",7,68,{visual:{species:"goat",facing:"left"}}],
  ["animals/koi-fish","Cá koi",14,52],
  ["trees/bamboo-tree","Tre",16,70,{footprint:[1,1]}],
];

const craftYard = [
  ["buildings/blacksmith","Nhà rèn",4,76,{footprint:[4,2]}],
  ["buildings/bakery","Lò bánh",16,76,{footprint:[4,2]}],
  ["objects/banner","Cờ hiệu",9,77,{footprint:[1,1]}],
  ["machines/coastal-workshop","Máy nghiền",4,79,{footprint:[2,2],visual:{machine:"grinder"}}],
  ["machines/coastal-workshop","Lò luyện kim",12,79,{footprint:[2,2],visual:{machine:"smelter"}}],
  ["machines/coastal-workshop","Máy lắp ráp tự động",17,79,{footprint:[2,2],visual:{machine:"assembler"}}],
  ["objects/cooking-pot","Nồi nấu",7,80,{footprint:[1,1]}],
  ["objects/brazier","Lò than",15,81,{footprint:[1,1],visual:{active:true}}],
  ["objects/stone-pile","Đống đá xây",4,82,{footprint:[1,1]}],
  ["objects/wooden-pallet","Kiện hàng gỗ",19,82,{footprint:[1,1]}],
  ["objects/kitchen-counter","Bàn bếp",6,83,{footprint:[2,1]}],
  ["objects/fountain","Đài phun nước",14,83,{footprint:[2,1]}],
  ["objects/crystal-chest","Rương pha lê",18,84,{footprint:[1,1]}],
  ["trees/magical-tree","Cây phát sáng",6,85,{footprint:[1,1]}],
  ["animals/snail","Ốc sên",8,84],
  ["animals/ladybug","Bọ rùa",10,86],
];

export const gardenSections = [
  { id:"farm", title:"Khu nông trại", detail:"Cây trồng, vật nuôi, nhà kính và tổ ong", waypoint:[10,32], firstRow:28 },
  { id:"workshop", title:"Khu xưởng", detail:"Cối xay, quầy hàng và máy đang chạy", waypoint:[10,42], firstRow:38 },
  { id:"woodland", title:"Vườn cây và ao", detail:"Các loài cây, thú hoang, ao nhỏ và lửa trại", waypoint:[10,50], firstRow:46 },
  { id:"coast",title:"Bến ven biển",detail:"Nhà câu cá, bến thuyền, tài nguyên bờ biển và luống lúa",waypoint:[10,63],firstRow:57 },
  { id:"craft-yard",title:"Sân nghề",detail:"Nhà rèn, lò bánh, máy nghiền, luyện kim và lắp ráp",waypoint:[10,80],firstRow:73 },
];

export const gardenSamples = [...farm,...crops,...field,...workshop,...woodland,...pond,...coast,...craftYard];
export const gardenAssetIds = [...new Set([...gardenSamples.map(([id]) => id),"tiles/dirt-path"])];
