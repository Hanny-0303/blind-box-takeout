/* 盲盒外卖 · 菜品库
 * 想加菜？照着下面的格式往 DISHES 里加一行就行。
 * spice: 0 不辣 / 1 微辣 / 2 正常辣 / 3 加辣
 * flavor: 清淡 / 咸香 / 酸甜 / 酸爽 / 麻辣 / 香辣 / 鲜香
 * protein: 鸡肉 / 牛肉 / 猪肉 / 海鲜 / 素食 / 其他
 * style: 汤汤水水 / 干香 / 小炒 / 炸烤 / 凉食 / 蒸煮
 */
const CATEGORIES = [
  { id: 'bowl', name: '盖饭', emoji: '🍚', color: '#FFE3C9' },
  { id: 'friedrice', name: '炒饭', emoji: '🍳', color: '#FFF0BF' },
  { id: 'soupnoodle', name: '汤面', emoji: '🍜', color: '#FCE2A8' },
  { id: 'drynoodle', name: '拌面', emoji: '🥢', color: '#E9F2C6' },
  { id: 'ricenoodle', name: '米粉', emoji: '🍲', color: '#DDF0D2' },
  { id: 'mixian', name: '米线', emoji: '🥘', color: '#D9F0EA' },

  { id: 'malatang', name: '麻辣烫', emoji: '🌶️', color: '#FFD9D1' },
  { id: 'hotpot', name: '火锅', emoji: '🍲', color: '#FFD5CC' },
  { id: 'bbq', name: '烧烤', emoji: '🍢', color: '#F3D2B8' },
  { id: 'sichuan', name: '川湘菜', emoji: '🔥', color: '#FFCFC2' },

  { id: 'burger', name: '炸鸡汉堡', emoji: '🍔', color: '#FFE0C2' },
  { id: 'pizza', name: '披萨意面', emoji: '🍕', color: '#FFE7C9' },
  { id: 'japanese', name: '日料', emoji: '🍣', color: '#E5E0FA' },
  { id: 'korean', name: '韩餐', emoji: '🍙', color: '#F0DDEB' },
  { id: 'sea', name: '东南亚', emoji: '🍛', color: '#DFF0D6' },

  { id: 'cantonese', name: '粤菜烧腊', emoji: '🍗', color: '#FFE9D6' },
  { id: 'dumpling', name: '饺子包子', emoji: '🥟', color: '#F5E7D2' },
  { id: 'snack', name: '小吃卤味', emoji: '🍢', color: '#F7DCC8' },
  { id: 'breakfast', name: '早餐', emoji: '🥣', color: '#F0E9D8' },

  { id: 'light', name: '轻食', emoji: '🥗', color: '#DFF3D8' },
  { id: 'dessert', name: '甜品饮品', emoji: '🍰', color: '#F6DEE8' },
];

const CATEGORY_GROUPS = [
  {
    id: 'staple', name: '主食', emoji: '🍚',
    note: '饭 · 面 · 粉 · 米线 · 饺子 · 早餐',
    cats: ['bowl', 'friedrice', 'soupnoodle', 'drynoodle', 'ricenoodle', 'mixian', 'dumpling', 'breakfast'],
  },
  {
    id: 'flavor', name: '口味', emoji: '🌶️',
    note: '麻辣烫 · 火锅 · 烧烤',
    cats: ['malatang', 'hotpot', 'bbq'],
  },
  {
    id: 'snack', name: '小吃', emoji: '🍢',
    note: '炸鸡汉堡 · 卤味 · 轻食',
    cats: ['burger', 'snack', 'light'],
  },
  {
    id: 'drink', name: '饮品', emoji: '🧋',
    note: '奶茶 · 咖啡 · 甜品',
    cats: ['dessert'],
  },
  {
    id: 'cuisine', name: '菜系', emoji: '🍣',
    note: '川湘 · 粤菜 · 日料 · 韩餐 · 东南亚 · 西餐',
    cats: ['sichuan', 'cantonese', 'japanese', 'korean', 'sea', 'pizza'],
  },
];

const SPICE_LABELS = ['不辣', '微辣', '正常辣', '加辣'];

const FLAVORS = ['清淡', '咸香', '酸甜', '酸爽', '麻辣', '香辣', '鲜香'];
const PROTEINS = ['鸡肉', '牛肉', '猪肉', '海鲜', '素食'];
const STYLES = ['汤汤水水', '干香', '小炒', '炸烤', '凉食', '蒸煮'];

const DISHES = [
  /* ---------------- 盖饭 ---------------- */
  { id: 'r1', name: '黄焖鸡米饭', short: '黄焖鸡', cat: 'bowl', spice: 2, price: 26, emoji: '🍗', desc: '酱汁拌饭，土豆比鸡还好吃', flavor: '咸香', protein: '鸡肉', style: '干香' },
  { id: 'r2', name: '番茄炒蛋盖饭', short: '番茄炒蛋', cat: 'bowl', spice: 0, price: 18, emoji: '🍅', desc: '酸甜下饭，永远的安全牌', flavor: '酸甜', protein: '素食', style: '小炒' },
  { id: 'r3', name: '鱼香肉丝盖饭', short: '鱼香肉丝', cat: 'bowl', spice: 1, price: 22, emoji: '🥢', desc: '一勺汁能干掉半碗饭', flavor: '酸甜', protein: '猪肉', style: '小炒' },
  { id: 'r4', name: '咖喱鸡排饭', short: '咖喱鸡排', cat: 'bowl', spice: 1, price: 28, emoji: '🍛', desc: '金黄浓稠，配一块脆鸡排', flavor: '咸香', protein: '鸡肉', style: '炸烤' },
  { id: 'r5', name: '台式卤肉饭', short: '卤肉饭', cat: 'bowl', spice: 0, price: 22, emoji: '🍖', desc: '肥瘦相间，卤汁浸透米饭', flavor: '咸香', protein: '猪肉', style: '干香' },
  { id: 'r7', name: '麻婆豆腐盖饭', short: '麻婆豆腐', cat: 'bowl', spice: 2, price: 20, emoji: '🌶️', desc: '麻辣烫嘴，就是停不下来', flavor: '麻辣', protein: '素食', style: '小炒' },
  { id: 'r10', name: '猪脚饭', short: '猪脚饭', cat: 'bowl', spice: 0, price: 28, emoji: '🐷', desc: '软糯胶质，配一勺酸菜', flavor: '咸香', protein: '猪肉', style: '干香' },

  /* ---------------- 炒饭 ---------------- */
  { id: 'r6', name: '扬州炒饭', short: '炒饭', cat: 'friedrice', spice: 0, price: 20, emoji: '🍚', desc: '粒粒分明，虾仁火腿都有', flavor: '咸香', protein: '其他', style: '小炒' },
  { id: 'fr1', name: '黄金蛋炒饭', short: '蛋炒饭', cat: 'friedrice', spice: 0, price: 16, emoji: '🍳', desc: '每一粒米都裹上蛋液', flavor: '咸香', protein: '素食', style: '小炒' },
  { id: 'fr2', name: '腊肠炒饭', short: '腊肠炒饭', cat: 'friedrice', spice: 0, price: 22, emoji: '🥓', desc: '广式腊肠的甜香，越嚼越香', flavor: '咸香', protein: '猪肉', style: '小炒' },
  { id: 'fr3', name: '海鲜炒饭', short: '海鲜炒饭', cat: 'friedrice', spice: 0, price: 26, emoji: '🦐', desc: '虾仁鱿鱼都给了，鲜得很直接', flavor: '鲜香', protein: '海鲜', style: '小炒' },
  { id: 'fr4', name: '菠萝炒饭', short: '菠萝炒饭', cat: 'friedrice', spice: 0, price: 28, emoji: '🍍', desc: '酸甜果香，配肉松意外搭', flavor: '酸甜', protein: '海鲜', style: '小炒' },
  { id: 'fr5', name: '黑椒牛肉炒饭', short: '黑椒牛肉', cat: 'friedrice', spice: 1, price: 28, emoji: '🥩', desc: '黑椒味很冲，牛肉粒不小', flavor: '咸香', protein: '牛肉', style: '小炒' },

  /* ---------------- 汤面 ---------------- */
  { id: 'n1', name: '兰州牛肉面', short: '牛肉面', cat: 'soupnoodle', spice: 1, price: 24, emoji: '🍜', desc: '清汤萝卜，辣油自己加', flavor: '鲜香', protein: '牛肉', style: '汤汤水水' },
  { id: 'n2', name: '重庆小面', short: '重庆小面', cat: 'soupnoodle', spice: 3, price: 16, emoji: '🌶️', desc: '麻辣鲜香，早起一碗醒神', flavor: '麻辣', protein: '素食', style: '汤汤水水' },
  { id: 'n3', name: '番茄鸡蛋面', short: '番茄鸡蛋面', cat: 'soupnoodle', spice: 0, price: 18, emoji: '🍅', desc: '汤都能喝干净的家常味', flavor: '酸甜', protein: '素食', style: '汤汤水水' },
  { id: 'n6', name: '豚骨拉面', short: '豚骨拉面', cat: 'soupnoodle', spice: 0, price: 36, emoji: '🍥', desc: '奶白汤底，叉烧入口即化', flavor: '鲜香', protein: '猪肉', style: '汤汤水水' },
  { id: 'n7', name: '酸菜牛肉面', short: '酸菜牛肉面', cat: 'soupnoodle', spice: 0, price: 26, emoji: '🥬', desc: '酸香开胃，牛肉给得实在', flavor: '酸爽', protein: '牛肉', style: '汤汤水水' },
  { id: 'sn1', name: '雪菜肉丝面', short: '雪菜肉丝', cat: 'soupnoodle', spice: 0, price: 18, emoji: '🥬', desc: '雪菜咸鲜，汤头很清爽', flavor: '咸香', protein: '猪肉', style: '汤汤水水' },
  { id: 'sn2', name: '三鲜汤面', short: '三鲜汤面', cat: 'soupnoodle', spice: 0, price: 22, emoji: '🍤', desc: '虾仁、鱼丸、青菜，一碗齐全', flavor: '鲜香', protein: '海鲜', style: '汤汤水水' },

  /* ---------------- 拌面 ---------------- */
  { id: 'n4', name: '老北京炸酱面', short: '炸酱面', cat: 'drynoodle', spice: 0, price: 20, emoji: '🥢', desc: '黄瓜丝配浓酱，拌到每根都上色', flavor: '咸香', protein: '猪肉', style: '干香' },
  { id: 'n5', name: '油泼面', short: '油泼面', cat: 'drynoodle', spice: 2, price: 22, emoji: '🔥', desc: '热油一泼，蒜香辣子香全出来', flavor: '香辣', protein: '素食', style: '干香' },
  { id: 'n8', name: '葱油拌面', short: '葱油拌面', cat: 'drynoodle', spice: 0, price: 16, emoji: '🧅', desc: '简单到极致，香到犯规', flavor: '咸香', protein: '素食', style: '干香' },
  { id: 'dn1', name: '武汉热干面', short: '热干面', cat: 'drynoodle', spice: 1, price: 15, emoji: '🍜', desc: '芝麻酱裹满，拌开要趁热', flavor: '咸香', protein: '素食', style: '干香' },
  { id: 'dn2', name: '新疆拌面', short: '新疆拌面', cat: 'drynoodle', spice: 1, price: 28, emoji: '🍝', desc: '面筋道，浇头给得豪爽', flavor: '咸香', protein: '牛肉', style: '干香' },
  { id: 'dn3', name: '麻酱凉面', short: '麻酱凉面', cat: 'drynoodle', spice: 0, price: 16, emoji: '🥒', desc: '夏天救命，芝麻酱配黄瓜丝', flavor: '咸香', protein: '素食', style: '凉食' },

  /* ---------------- 米粉 ---------------- */
  { id: 'f1', name: '螺蛳粉', short: '螺蛳粉', cat: 'ricenoodle', spice: 2, price: 22, emoji: '🍲', desc: '闻着上头，吃着更上头', flavor: '酸爽', protein: '其他', style: '汤汤水水' },
  { id: 'f2', name: '桂林米粉', short: '桂林米粉', cat: 'ricenoodle', spice: 1, price: 18, emoji: '🍜', desc: '卤水香，锅烧脆', flavor: '咸香', protein: '猪肉', style: '汤汤水水' },
  { id: 'f3', name: '酸辣粉', short: '酸辣粉', cat: 'ricenoodle', spice: 3, price: 14, emoji: '🌶️', desc: '酸辣冲鼻，粉条滑溜', flavor: '酸爽', protein: '素食', style: '汤汤水水' },
  { id: 'f4', name: '常德牛肉粉', short: '牛肉粉', cat: 'ricenoodle', spice: 1, price: 24, emoji: '🥩', desc: '红油汤底，牛肉大片', flavor: '香辣', protein: '牛肉', style: '汤汤水水' },
  { id: 'f6', name: '鸭血粉丝汤', short: '鸭血粉丝', cat: 'ricenoodle', spice: 1, price: 20, emoji: '🦆', desc: '汤鲜料足，冬天救命', flavor: '鲜香', protein: '其他', style: '汤汤水水' },
  { id: 'f7', name: '湖南米粉', short: '湖南米粉', cat: 'ricenoodle', spice: 2, price: 20, emoji: '🌶️', desc: '剁椒盖顶，辣得痛快', flavor: '香辣', protein: '猪肉', style: '汤汤水水' },

  /* ---------------- 米线 ---------------- */
  { id: 'm1', name: '过桥米线', short: '过桥米线', cat: 'mixian', spice: 0, price: 32, emoji: '🍲', desc: '滚汤烫熟，仪式感拉满', flavor: '鲜香', protein: '鸡肉', style: '汤汤水水' },
  { id: 'm2', name: '小锅米线', short: '小锅米线', cat: 'mixian', spice: 2, price: 24, emoji: '🥘', desc: '酸辣浓汤，韭菜点睛', flavor: '香辣', protein: '猪肉', style: '汤汤水水' },
  { id: 'm3', name: '番茄肥牛米线', short: '肥牛米线', cat: 'mixian', spice: 0, price: 28, emoji: '🍅', desc: '酸甜汤底，肥牛管够', flavor: '酸甜', protein: '牛肉', style: '汤汤水水' },
  { id: 'm4', name: '酸汤米线', short: '酸汤米线', cat: 'mixian', spice: 1, price: 26, emoji: '🥬', desc: '开胃酸香，越吃越顺', flavor: '酸爽', protein: '素食', style: '汤汤水水' },
  { id: 'm5', name: '云南菌菇米线', short: '菌菇米线', cat: 'mixian', spice: 0, price: 30, emoji: '🍄', desc: '菌香清甜，汤头很鲜', flavor: '鲜香', protein: '素食', style: '汤汤水水' },
  { id: 'm6', name: '辣子鸡米线', short: '辣子鸡', cat: 'mixian', spice: 3, price: 26, emoji: '🔥', desc: '干香辣子鸡，配汤刚好', flavor: '香辣', protein: '鸡肉', style: '汤汤水水' },

  /* ---------------- 麻辣烫 ---------------- */
  { id: 'x1', name: '麻辣烫', short: '麻辣烫', cat: 'malatang', spice: 1, price: 28, emoji: '🥘', desc: '想吃什么自己夹，微辣刚好', flavor: '麻辣', protein: '其他', style: '汤汤水水' },
  { id: 'x2', name: '麻辣拌', short: '麻辣拌', cat: 'malatang', spice: 2, price: 26, emoji: '🥡', desc: '无汤版麻辣烫，酱汁裹满', flavor: '麻辣', protein: '其他', style: '干香' },
  { id: 'x3', name: '冒菜', short: '冒菜', cat: 'malatang', spice: 2, price: 32, emoji: '🍲', desc: '一个人的火锅，配米饭绝了', flavor: '麻辣', protein: '其他', style: '汤汤水水' },
  { id: 'x5', name: '麻辣香锅', short: '麻辣香锅', cat: 'malatang', spice: 3, price: 45, emoji: '🌶️', desc: '重口快乐，配冰可乐', flavor: '香辣', protein: '其他', style: '小炒' },
  { id: 'x6', name: '番茄麻辣烫', short: '番茄烫', cat: 'malatang', spice: 0, price: 30, emoji: '🍅', desc: '不吃辣也能拥有的麻辣烫', flavor: '酸甜', protein: '素食', style: '汤汤水水' },
  { id: 'x7', name: '菌汤麻辣烫', short: '菌汤烫', cat: 'malatang', spice: 0, price: 28, emoji: '🍄', desc: '菌汤打底，鲜得能喝汤', flavor: '鲜香', protein: '素食', style: '汤汤水水' },

  /* ---------------- 火锅 ---------------- */
  { id: 'hp1', name: '一人食小火锅', short: '小火锅', cat: 'hotpot', spice: 2, price: 38, emoji: '🍲', desc: '一个人也能热气腾腾', flavor: '麻辣', protein: '牛肉', style: '汤汤水水' },
  { id: 'hp2', name: '番茄火锅', short: '番茄锅', cat: 'hotpot', spice: 0, price: 35, emoji: '🍅', desc: '汤底能喝三碗，涮啥都好吃', flavor: '酸甜', protein: '素食', style: '汤汤水水' },
  { id: 'hp3', name: '菌汤锅', short: '菌汤锅', cat: 'hotpot', spice: 0, price: 36, emoji: '🍄', desc: '菌菇熬出来的鲜，很温柔', flavor: '鲜香', protein: '素食', style: '汤汤水水' },
  { id: 'hp4', name: '酸汤鱼火锅', short: '酸汤鱼', cat: 'hotpot', spice: 1, price: 52, emoji: '🐟', desc: '酸得开胃，鱼片嫩滑', flavor: '酸爽', protein: '海鲜', style: '汤汤水水' },
  { id: 'hp5', name: '毛肚火锅', short: '毛肚锅', cat: 'hotpot', spice: 3, price: 48, emoji: '🌶️', desc: '七上八下，脆得很过瘾', flavor: '麻辣', protein: '牛肉', style: '汤汤水水' },
  { id: 'hp6', name: '椰子鸡火锅', short: '椰子鸡', cat: 'hotpot', spice: 0, price: 58, emoji: '🥥', desc: '清甜汤底，鸡肉蘸小青桔', flavor: '清淡', protein: '鸡肉', style: '汤汤水水' },

  /* ---------------- 烧烤 ---------------- */
  { id: 'bb1', name: '羊肉串', short: '羊肉串', cat: 'bbq', spice: 2, price: 30, emoji: '🍢', desc: '孜然一撒，夜宵就有了灵魂', flavor: '香辣', protein: '其他', style: '炸烤' },
  { id: 'bb2', name: '烤五花肉', short: '烤五花', cat: 'bbq', spice: 1, price: 28, emoji: '🥓', desc: '焦边冒油，包生菜最好吃', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'bb3', name: '烤鸡翅', short: '烤鸡翅', cat: 'bbq', spice: 1, price: 25, emoji: '🍗', desc: '外焦里嫩，两只起步', flavor: '咸香', protein: '鸡肉', style: '炸烤' },
  { id: 'bb4', name: '蒜蓉烤茄子', short: '烤茄子', cat: 'bbq', spice: 0, price: 16, emoji: '🍆', desc: '蒜香铺满，茄子软到脱骨', flavor: '咸香', protein: '素食', style: '炸烤' },
  { id: 'bb5', name: '烤鱼', short: '烤鱼', cat: 'bbq', spice: 2, price: 68, emoji: '🐟', desc: '边烤边吃，配菜越煮越入味', flavor: '麻辣', protein: '海鲜', style: '炸烤' },
  { id: 'bb6', name: '炸串拼盘', short: '炸串', cat: 'bbq', spice: 2, price: 32, emoji: '🍡', desc: '一把签子，刷满甜辣酱', flavor: '香辣', protein: '其他', style: '炸烤' },

  /* ---------------- 炸鸡汉堡 ---------------- */
  { id: 'b1', name: '香辣鸡腿堡', short: '鸡腿堡', cat: 'burger', spice: 2, price: 25, emoji: '🍔', desc: '外皮酥脆，辣味够劲', flavor: '香辣', protein: '鸡肉', style: '炸烤' },
  { id: 'b2', name: '双层牛肉堡', short: '牛肉堡', cat: 'burger', spice: 0, price: 32, emoji: '🍔', desc: '两手抓着吃，肉汁横流', flavor: '咸香', protein: '牛肉', style: '炸烤' },
  { id: 'b3', name: '炸鸡桶', short: '炸鸡桶', cat: 'burger', spice: 1, price: 58, emoji: '🍗', desc: '快乐加倍，罪恶也加倍', flavor: '咸香', protein: '鸡肉', style: '炸烤' },
  { id: 'b4', name: '薯条汉堡套餐', short: '汉堡套餐', cat: 'burger', spice: 0, price: 29, emoji: '🍟', desc: '经典组合，不会出错', flavor: '咸香', protein: '牛肉', style: '炸烤' },
  { id: 'b5', name: '鸡肉卷', short: '鸡肉卷', cat: 'burger', spice: 1, price: 18, emoji: '🌯', desc: '边走边吃，酱多到爆', flavor: '咸香', protein: '鸡肉', style: '炸烤' },
  { id: 'b6', name: '和牛汉堡', short: '和牛堡', cat: 'burger', spice: 0, price: 88, emoji: '🍔', desc: '贵一点，但肉饼是真的香', flavor: '咸香', protein: '牛肉', style: '炸烤' },
  { id: 'b7', name: '无骨炸鸡', short: '无骨炸鸡', cat: 'burger', spice: 2, price: 35, emoji: '🍗', desc: '不用吐骨头，追剧神器', flavor: '香辣', protein: '鸡肉', style: '炸烤' },

  /* ---------------- 披萨意面 ---------------- */
  { id: 'pz1', name: '玛格丽特披萨', short: '玛格丽特', cat: 'pizza', spice: 0, price: 45, emoji: '🍕', desc: '番茄罗勒芝士，简单经典', flavor: '酸甜', protein: '素食', style: '炸烤' },
  { id: 'pz2', name: '榴莲披萨', short: '榴莲披萨', cat: 'pizza', spice: 0, price: 58, emoji: '🍕', desc: '榴莲肉铺满，爱的人很爱', flavor: '酸甜', protein: '素食', style: '炸烤' },
  { id: 'pz3', name: '培根披萨', short: '培根披萨', cat: 'pizza', spice: 0, price: 52, emoji: '🍕', desc: '培根烤到微焦，咸香拉丝', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'pz4', name: '番茄肉酱意面', short: '肉酱意面', cat: 'pizza', spice: 0, price: 38, emoji: '🍝', desc: '肉酱厚厚一层，拌开很治愈', flavor: '酸甜', protein: '牛肉', style: '干香' },
  { id: 'pz5', name: '奶油培根意面', short: '奶油意面', cat: 'pizza', spice: 0, price: 42, emoji: '🍝', desc: '奶香浓到糊嘴，热量警告', flavor: '咸香', protein: '猪肉', style: '干香' },
  { id: 'pz6', name: '青酱意面', short: '青酱意面', cat: 'pizza', spice: 0, price: 36, emoji: '🌿', desc: '罗勒清香，吃完不会太撑', flavor: '鲜香', protein: '素食', style: '干香' },

  /* ---------------- 日料 ---------------- */
  { id: 'j1', name: '三文鱼刺身饭', short: '刺身饭', cat: 'japanese', spice: 0, price: 68, emoji: '🍣', desc: '厚切三文鱼，配芥末刚好', flavor: '鲜香', protein: '海鲜', style: '凉食' },
  { id: 'j2', name: '寿司拼盘', short: '寿司拼盘', cat: 'japanese', spice: 0, price: 88, emoji: '🍱', desc: '一次吃到八种口味', flavor: '鲜香', protein: '海鲜', style: '凉食' },
  { id: 'j3', name: '鳗鱼饭', short: '鳗鱼饭', cat: 'japanese', spice: 0, price: 78, emoji: '🍱', desc: '酱香蒲烧，甜咸交织', flavor: '酸甜', protein: '海鲜', style: '干香' },
  { id: 'j4', name: '天妇罗乌冬', short: '天妇罗乌冬', cat: 'japanese', spice: 0, price: 42, emoji: '🍤', desc: '汤清面滑，天妇罗酥脆', flavor: '鲜香', protein: '海鲜', style: '汤汤水水' },
  { id: 'j5', name: '刺身拼盘', short: '刺身拼盘', cat: 'japanese', spice: 0, price: 128, emoji: '🐟', desc: '发工资那天值得拥有', flavor: '鲜香', protein: '海鲜', style: '凉食' },
  { id: 'j6', name: '照烧鸡排饭', short: '照烧鸡', cat: 'japanese', spice: 0, price: 38, emoji: '🍗', desc: '甜咸照烧汁，拌饭一绝', flavor: '酸甜', protein: '鸡肉', style: '干香' },

  /* ---------------- 韩餐 ---------------- */
  { id: 'r8', name: '石锅拌饭', short: '拌饭', cat: 'korean', spice: 1, price: 28, emoji: '🍳', desc: '锅巴焦香，拌开那一刻最治愈', flavor: '香辣', protein: '素食', style: '干香' },
  { id: 'kr1', name: '部队锅', short: '部队锅', cat: 'korean', spice: 2, price: 45, emoji: '🍲', desc: '午餐肉方便面芝士，快乐乱炖', flavor: '香辣', protein: '猪肉', style: '汤汤水水' },
  { id: 'kr2', name: '韩式炸鸡', short: '韩式炸鸡', cat: 'korean', spice: 2, price: 42, emoji: '🍗', desc: '甜辣酱裹满，配啤酒更佳', flavor: '香辣', protein: '鸡肉', style: '炸烤' },
  { id: 'kr3', name: '韩式冷面', short: '冷面', cat: 'korean', spice: 0, price: 28, emoji: '🍜', desc: '冰碴子汤底，酸甜解腻', flavor: '酸甜', protein: '牛肉', style: '凉食' },
  { id: 'kr4', name: '紫菜包饭', short: '紫菜包饭', cat: 'korean', spice: 0, price: 22, emoji: '🍙', desc: '一口一个，配料很扎实', flavor: '咸香', protein: '素食', style: '凉食' },
  { id: 'kr5', name: '辣炒年糕', short: '辣炒年糕', cat: 'korean', spice: 2, price: 26, emoji: '🍢', desc: '年糕软糯，酱汁甜辣', flavor: '香辣', protein: '素食', style: '小炒' },

  /* ---------------- 东南亚 ---------------- */
  { id: 'se1', name: '冬阴功汤', short: '冬阴功', cat: 'sea', spice: 2, price: 48, emoji: '🦐', desc: '酸辣带椰香，喝一口就开胃', flavor: '酸爽', protein: '海鲜', style: '汤汤水水' },
  { id: 'se2', name: '泰式炒河粉', short: '泰式河粉', cat: 'sea', spice: 0, price: 36, emoji: '🍜', desc: '花生碎加青柠，酸甜有层次', flavor: '酸甜', protein: '海鲜', style: '小炒' },
  { id: 'se3', name: '越南牛肉粉', short: '越南牛肉粉', cat: 'sea', spice: 0, price: 32, emoji: '🍲', desc: '清汤慢熬，牛肉片很嫩', flavor: '鲜香', protein: '牛肉', style: '汤汤水水' },
  { id: 'se4', name: '海南鸡饭', short: '海南鸡饭', cat: 'sea', spice: 0, price: 36, emoji: '🍗', desc: '鸡油饭香，蘸酱是灵魂', flavor: '清淡', protein: '鸡肉', style: '干香' },
  { id: 'se5', name: '咖喱牛腩饭', short: '咖喱牛腩', cat: 'sea', spice: 1, price: 42, emoji: '🍛', desc: '牛腩炖到软烂，咖喱拌饭', flavor: '咸香', protein: '牛肉', style: '干香' },
  { id: 'se6', name: '菠萝海鲜炒饭', short: '菠萝海鲜', cat: 'sea', spice: 0, price: 38, emoji: '🍍', desc: '菠萝壳当碗，酸甜清爽', flavor: '酸甜', protein: '海鲜', style: '小炒' },

  /* ---------------- 川湘菜 ---------------- */
  { id: 'sc1', name: '水煮牛肉', short: '水煮牛肉', cat: 'sichuan', spice: 3, price: 48, emoji: '🌶️', desc: '红油翻滚，牛肉嫩得筷子夹不住', flavor: '麻辣', protein: '牛肉', style: '汤汤水水' },
  { id: 'sc2', name: '辣子鸡', short: '辣子鸡', cat: 'sichuan', spice: 3, price: 42, emoji: '🔥', desc: '在辣椒里找鸡块，越找越上瘾', flavor: '香辣', protein: '鸡肉', style: '炸烤' },
  { id: 'sc3', name: '剁椒鱼头', short: '剁椒鱼头', cat: 'sichuan', spice: 2, price: 58, emoji: '🐟', desc: '剁椒鲜辣，鱼头嫩滑', flavor: '香辣', protein: '海鲜', style: '汤汤水水' },
  { id: 'sc4', name: '小炒黄牛肉', short: '小炒牛肉', cat: 'sichuan', spice: 2, price: 45, emoji: '🥩', desc: '锅气十足，下饭利器', flavor: '香辣', protein: '牛肉', style: '小炒' },
  { id: 'sc5', name: '干锅花菜', short: '干锅花菜', cat: 'sichuan', spice: 2, price: 28, emoji: '🥦', desc: '花菜吸满辣油，比肉还香', flavor: '香辣', protein: '素食', style: '小炒' },
  { id: 'sc6', name: '毛血旺', short: '毛血旺', cat: 'sichuan', spice: 3, price: 45, emoji: '🍲', desc: '料多到捞不完，麻辣过瘾', flavor: '麻辣', protein: '其他', style: '汤汤水水' },

  /* ---------------- 粤菜烧腊 ---------------- */
  { id: 'r9', name: '腊味煲仔饭', short: '煲仔饭', cat: 'cantonese', spice: 0, price: 32, emoji: '🍲', desc: '腊肠油香渗进每一粒米', flavor: '咸香', protein: '猪肉', style: '干香' },
  { id: 'f5', name: '干炒牛河', short: '干炒牛河', cat: 'cantonese', spice: 0, price: 28, emoji: '🥡', desc: '镬气十足，油亮不腻', flavor: '咸香', protein: '牛肉', style: '小炒' },
  { id: 'ct1', name: '蜜汁叉烧饭', short: '叉烧饭', cat: 'cantonese', spice: 0, price: 28, emoji: '🍖', desc: '蜜汁焦边，甜咸刚好', flavor: '酸甜', protein: '猪肉', style: '干香' },
  { id: 'ct2', name: '烧鸭饭', short: '烧鸭饭', cat: 'cantonese', spice: 0, price: 30, emoji: '🦆', desc: '皮脆肉嫩，配酸梅酱', flavor: '咸香', protein: '其他', style: '干香' },
  { id: 'ct3', name: '白切鸡饭', short: '白切鸡', cat: 'cantonese', spice: 0, price: 32, emoji: '🍗', desc: '鸡有鸡味，姜葱酱油是灵魂', flavor: '清淡', protein: '鸡肉', style: '干香' },
  { id: 'ct4', name: '虾饺', short: '虾饺', cat: 'cantonese', spice: 0, price: 26, emoji: '🥟', desc: '皮薄透亮，整只虾仁', flavor: '鲜香', protein: '海鲜', style: '蒸煮' },

  /* ---------------- 轻食 ---------------- */
  { id: 'l1', name: '鸡胸肉沙拉', short: '鸡肉沙拉', cat: 'light', spice: 0, price: 32, emoji: '🥗', desc: '清爽但不寡淡，酱汁另装', flavor: '清淡', protein: '鸡肉', style: '凉食' },
  { id: 'l2', name: '牛油果三明治', short: '牛油果', cat: 'light', spice: 0, price: 28, emoji: '🥪', desc: '绵密牛油果，配全麦面包', flavor: '清淡', protein: '素食', style: '凉食' },
  { id: 'l3', name: '藜麦能量碗', short: '藜麦碗', cat: 'light', spice: 0, price: 36, emoji: '🥣', desc: '五颜六色，吃完很轻盈', flavor: '清淡', protein: '素食', style: '凉食' },
  { id: 'l4', name: '三文鱼波奇饭', short: '波奇饭', cat: 'light', spice: 0, price: 45, emoji: '🍣', desc: '海味配米饭，夏天首选', flavor: '清淡', protein: '海鲜', style: '凉食' },
  { id: 'l5', name: '低卡鸡肉卷', short: '低卡鸡肉卷', cat: 'light', spice: 0, price: 26, emoji: '🌯', desc: '卷得扎实，热量友好', flavor: '清淡', protein: '鸡肉', style: '凉食' },
  { id: 'l6', name: '希腊酸奶碗', short: '酸奶碗', cat: 'light', spice: 0, price: 22, emoji: '🥛', desc: '莓果加坚果，甜得很克制', flavor: '酸甜', protein: '素食', style: '凉食' },

  /* ---------------- 早餐 ---------------- */
  { id: 'bf1', name: '豆浆油条', short: '豆浆油条', cat: 'breakfast', spice: 0, price: 12, emoji: '🥛', desc: '油条泡豆浆，早餐的确定感', flavor: '清淡', protein: '素食', style: '炸烤' },
  { id: 'bf2', name: '皮蛋瘦肉粥', short: '瘦肉粥', cat: 'breakfast', spice: 0, price: 15, emoji: '🥣', desc: '熬到绵密，胃不舒服就吃它', flavor: '清淡', protein: '猪肉', style: '汤汤水水' },
  { id: 'bf3', name: '煎饼果子', short: '煎饼果子', cat: 'breakfast', spice: 0, price: 12, emoji: '🌯', desc: '加蛋加脆饼，一口满足', flavor: '咸香', protein: '素食', style: '炸烤' },
  { id: 'bf4', name: '广式肠粉', short: '肠粉', cat: 'breakfast', spice: 0, price: 16, emoji: '🍥', desc: '米皮滑嫩，酱油要够', flavor: '清淡', protein: '猪肉', style: '蒸煮' },
  { id: 'bf5', name: '饭团', short: '饭团', cat: 'breakfast', spice: 0, price: 10, emoji: '🍙', desc: '捏得紧实，边走边吃', flavor: '咸香', protein: '素食', style: '干香' },
  { id: 'bf6', name: '茶叶蛋', short: '茶叶蛋', cat: 'breakfast', spice: 0, price: 3, emoji: '🥚', desc: '卤到入味，早餐加一个', flavor: '咸香', protein: '素食', style: '蒸煮' },

  /* ---------------- 饺子包子 ---------------- */
  { id: 'dp1', name: '猪肉白菜饺子', short: '白菜饺子', cat: 'dumpling', spice: 0, price: 22, emoji: '🥟', desc: '皮薄馅大，蘸醋一绝', flavor: '咸香', protein: '猪肉', style: '蒸煮' },
  { id: 'dp2', name: '韭菜鸡蛋饺子', short: '韭菜饺子', cat: 'dumpling', spice: 0, price: 20, emoji: '🥟', desc: '素馅也能很香', flavor: '咸香', protein: '素食', style: '蒸煮' },
  { id: 'dp3', name: '小笼包', short: '小笼包', cat: 'dumpling', spice: 0, price: 18, emoji: '🥟', desc: '先咬一口吸汤，别烫着', flavor: '鲜香', protein: '猪肉', style: '蒸煮' },
  { id: 'dp4', name: '生煎包', short: '生煎包', cat: 'dumpling', spice: 0, price: 20, emoji: '🥟', desc: '底脆汁多，撒一把芝麻', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'dp5', name: '灌汤包', short: '灌汤包', cat: 'dumpling', spice: 0, price: 22, emoji: '🥟', desc: '汤在包里，小心烫嘴', flavor: '鲜香', protein: '猪肉', style: '蒸煮' },
  { id: 'dp6', name: '红油抄手', short: '红油抄手', cat: 'dumpling', spice: 2, price: 18, emoji: '🌶️', desc: '红油香而不燥，抄手皮滑', flavor: '麻辣', protein: '猪肉', style: '汤汤水水' },

  /* ---------------- 小吃卤味 ---------------- */
  { id: 'x4', name: '关东煮', short: '关东煮', cat: 'snack', spice: 0, price: 18, emoji: '🍢', desc: '清淡暖胃，萝卜煮到透明', flavor: '清淡', protein: '素食', style: '汤汤水水' },
  { id: 'sk1', name: '卤鸡爪', short: '卤鸡爪', cat: 'snack', spice: 0, price: 18, emoji: '🍗', desc: '软糯脱骨，追剧必备', flavor: '咸香', protein: '鸡肉', style: '凉食' },
  { id: 'sk2', name: '卤牛肉', short: '卤牛肉', cat: 'snack', spice: 0, price: 32, emoji: '🥩', desc: '切片蘸辣椒面，越嚼越香', flavor: '咸香', protein: '牛肉', style: '凉食' },
  { id: 'sk3', name: '炸鸡排', short: '炸鸡排', cat: 'snack', spice: 2, price: 18, emoji: '🍗', desc: '比脸还大，撒梅子粉', flavor: '香辣', protein: '鸡肉', style: '炸烤' },
  { id: 'sk4', name: '臭豆腐', short: '臭豆腐', cat: 'snack', spice: 2, price: 15, emoji: '🧈', desc: '闻着臭，吃着香，汁水很足', flavor: '香辣', protein: '素食', style: '炸烤' },
  { id: 'sk5', name: '凉皮', short: '凉皮', cat: 'snack', spice: 1, price: 16, emoji: '🥒', desc: '筋道爽口，辣油是灵魂', flavor: '酸爽', protein: '素食', style: '凉食' },

  /* ---------------- 甜品饮品 ---------------- */
  { id: 'ds1', name: '杨枝甘露', short: '杨枝甘露', cat: 'dessert', spice: 0, price: 22, emoji: '🥭', desc: '芒果西柚椰奶，甜得很清爽', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds2', name: '提拉米苏', short: '提拉米苏', cat: 'dessert', spice: 0, price: 28, emoji: '🍰', desc: '咖啡酒香，入口即化', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds3', name: '芋圆烧仙草', short: '芋圆仙草', cat: 'dessert', spice: 0, price: 18, emoji: '🍧', desc: '料多到像在吃粥', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds4', name: '珍珠奶茶', short: '奶茶', cat: 'dessert', spice: 0, price: 15, emoji: '🧋', desc: '三分糖去冰，快乐水', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds5', name: '蛋挞', short: '蛋挞', cat: 'dessert', spice: 0, price: 10, emoji: '🥧', desc: '酥皮掉渣，蛋香浓郁', flavor: '酸甜', protein: '素食', style: '炸烤' },
  { id: 'ds6', name: '红豆双皮奶', short: '双皮奶', cat: 'dessert', spice: 0, price: 18, emoji: '🍮', desc: '奶皮厚实，红豆绵软', flavor: '酸甜', protein: '素食', style: '凉食' },
  /* ================= 补充菜品：每个分类凑满 10 道 ================= */

  /* 盖饭 +3 */
  { id: 'bo1', name: '宫保鸡丁盖饭', short: '宫保鸡丁', cat: 'bowl', spice: 2, price: 24, emoji: '🥜', desc: '花生脆、鸡丁嫩，酸甜带辣', flavor: '酸甜', protein: '鸡肉', style: '小炒' },
  { id: 'bo2', name: '黑椒牛柳盖饭', short: '黑椒牛柳', cat: 'bowl', spice: 1, price: 32, emoji: '🥩', desc: '黑椒汁浓，牛柳给得大方', flavor: '咸香', protein: '牛肉', style: '小炒' },
  { id: 'bo3', name: '梅菜扣肉饭', short: '梅菜扣肉', cat: 'bowl', spice: 0, price: 30, emoji: '🍖', desc: '肥而不腻，梅菜比肉还下饭', flavor: '咸香', protein: '猪肉', style: '蒸煮' },

  /* 炒饭 +4 */
  { id: 'fr6', name: '虾仁蛋炒饭', short: '虾仁炒饭', cat: 'friedrice', spice: 0, price: 26, emoji: '🍤', desc: '虾仁弹牙，蛋香裹着米粒', flavor: '鲜香', protein: '海鲜', style: '小炒' },
  { id: 'fr7', name: '酱油炒饭', short: '酱油炒饭', cat: 'friedrice', spice: 0, price: 14, emoji: '🍚', desc: '酱油香一炒就出来，朴素但上头', flavor: '咸香', protein: '素食', style: '小炒' },
  { id: 'fr8', name: '牛肉粒炒饭', short: '牛肉炒饭', cat: 'friedrice', spice: 1, price: 30, emoji: '🥩', desc: '牛肉粒有嚼劲，黑椒提味', flavor: '咸香', protein: '牛肉', style: '小炒' },
  { id: 'fr9', name: '咖喱鸡肉炒饭', short: '咖喱炒饭', cat: 'friedrice', spice: 1, price: 26, emoji: '🍛', desc: '咖喱粉裹满每粒米', flavor: '咸香', protein: '鸡肉', style: '小炒' },

  /* 汤面 +3 */
  { id: 'sn3', name: '红烧牛肉面', short: '红烧牛肉', cat: 'soupnoodle', spice: 1, price: 28, emoji: '🍜', desc: '汤浓肉大块，面条筋道', flavor: '咸香', protein: '牛肉', style: '汤汤水水' },
  { id: 'sn4', name: '番茄牛腩面', short: '番茄牛腩', cat: 'soupnoodle', spice: 0, price: 30, emoji: '🍅', desc: '番茄熬到起沙，牛腩软烂', flavor: '酸甜', protein: '牛肉', style: '汤汤水水' },
  { id: 'sn5', name: '海鲜汤面', short: '海鲜汤面', cat: 'soupnoodle', spice: 0, price: 32, emoji: '🦐', desc: '虾、蛤蜊、鱿鱼，一碗海味', flavor: '鲜香', protein: '海鲜', style: '汤汤水水' },

  /* 拌面 +4 */
  { id: 'dn4', name: '韩式炸酱面', short: '韩式炸酱', cat: 'drynoodle', spice: 0, price: 22, emoji: '🍜', desc: '春酱甜咸，配黄萝卜', flavor: '咸香', protein: '猪肉', style: '干香' },
  { id: 'dn5', name: '葱油开洋面', short: '开洋拌面', cat: 'drynoodle', spice: 0, price: 24, emoji: '🍤', desc: '开洋提鲜，葱油香得直接', flavor: '鲜香', protein: '海鲜', style: '干香' },
  { id: 'dn6', name: '川味凉面', short: '川味凉面', cat: 'drynoodle', spice: 2, price: 16, emoji: '🌶️', desc: '麻辣带甜，夏天来一碗', flavor: '麻辣', protein: '素食', style: '凉食' },
  { id: 'dn7', name: '鸡丝凉面', short: '鸡丝凉面', cat: 'drynoodle', spice: 1, price: 20, emoji: '🍗', desc: '芝麻酱拌鸡丝，清爽管饱', flavor: '咸香', protein: '鸡肉', style: '凉食' },

  /* 米粉 +4 */
  { id: 'rn1', name: '南宁老友粉', short: '老友粉', cat: 'ricenoodle', spice: 2, price: 22, emoji: '🍜', desc: '酸笋豆豉爆香，南宁人的早晨', flavor: '酸爽', protein: '猪肉', style: '汤汤水水' },
  { id: 'rn2', name: '衡阳鱼粉', short: '衡阳鱼粉', cat: 'ricenoodle', spice: 2, price: 24, emoji: '🐟', desc: '鱼汤奶白，辣得温和', flavor: '香辣', protein: '海鲜', style: '汤汤水水' },
  { id: 'rn3', name: '潮汕粿条', short: '潮汕粿条', cat: 'ricenoodle', spice: 0, price: 28, emoji: '🍲', desc: '清汤牛肉丸，粿条滑溜', flavor: '清淡', protein: '牛肉', style: '汤汤水水' },
  { id: 'rn4', name: '海南粉', short: '海南粉', cat: 'ricenoodle', spice: 1, price: 20, emoji: '🥢', desc: '卤汁拌粉，配黄灯笼椒', flavor: '咸香', protein: '猪肉', style: '干香' },

  /* 米线 +4 */
  { id: 'mx1', name: '砂锅米线', short: '砂锅米线', cat: 'mixian', spice: 1, price: 26, emoji: '🍲', desc: '砂锅端上来还在滚', flavor: '咸香', protein: '猪肉', style: '汤汤水水' },
  { id: 'mx2', name: '泡椒米线', short: '泡椒米线', cat: 'mixian', spice: 2, price: 24, emoji: '🌶️', desc: '泡椒酸辣，越吃越开胃', flavor: '酸爽', protein: '鸡肉', style: '汤汤水水' },
  { id: 'mx3', name: '三鲜米线', short: '三鲜米线', cat: 'mixian', spice: 0, price: 26, emoji: '🍤', desc: '虾仁、肉片、菌菇，清鲜', flavor: '鲜香', protein: '海鲜', style: '汤汤水水' },
  { id: 'mx4', name: '麻辣米线', short: '麻辣米线', cat: 'mixian', spice: 3, price: 22, emoji: '🌶️', desc: '红油铺满，重口爱好者', flavor: '麻辣', protein: '素食', style: '汤汤水水' },

  /* 麻辣烫 +4 */
  { id: 'mt1', name: '骨汤麻辣烫', short: '骨汤烫', cat: 'malatang', spice: 0, price: 28, emoji: '🍲', desc: '骨汤打底，不辣也香', flavor: '咸香', protein: '素食', style: '汤汤水水' },
  { id: 'mt2', name: '酸辣麻辣烫', short: '酸辣烫', cat: 'malatang', spice: 2, price: 28, emoji: '🌶️', desc: '酸辣汤底，蔬菜吸汁', flavor: '酸爽', protein: '素食', style: '汤汤水水' },
  { id: 'mt3', name: '麻酱麻辣烫', short: '麻酱烫', cat: 'malatang', spice: 0, price: 30, emoji: '🥜', desc: '麻酱厚厚一层，干拌派', flavor: '咸香', protein: '素食', style: '干香' },
  { id: 'mt4', name: '藤椒麻辣烫', short: '藤椒烫', cat: 'malatang', spice: 2, price: 30, emoji: '🌿', desc: '藤椒清麻，后劲很足', flavor: '麻辣', protein: '素食', style: '汤汤水水' },

  /* 火锅 +4 */
  { id: 'hp7', name: '番茄牛腩锅', short: '番茄牛腩锅', cat: 'hotpot', spice: 0, price: 52, emoji: '🍅', desc: '番茄汤底，牛腩炖到软', flavor: '酸甜', protein: '牛肉', style: '汤汤水水' },
  { id: 'hp8', name: '麻辣牛油锅', short: '牛油锅', cat: 'hotpot', spice: 3, price: 58, emoji: '🌶️', desc: '牛油锅底，涮啥都香', flavor: '麻辣', protein: '牛肉', style: '汤汤水水' },
  { id: 'hp9', name: '猪肚鸡火锅', short: '猪肚鸡', cat: 'hotpot', spice: 0, price: 62, emoji: '🍲', desc: '胡椒猪肚鸡，先喝三碗汤', flavor: '清淡', protein: '鸡肉', style: '汤汤水水' },
  { id: 'hp10', name: '寿喜锅', short: '寿喜锅', cat: 'hotpot', spice: 0, price: 58, emoji: '🍲', desc: '甜咸锅底，牛肉蘸蛋液', flavor: '酸甜', protein: '牛肉', style: '汤汤水水' },

  /* 烧烤 +4 */
  { id: 'bb7', name: '烤肉拼盘', short: '烤肉拼盘', cat: 'bbq', spice: 1, price: 58, emoji: '🥩', desc: '猪牛鸡都有，适合分着吃', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'bb8', name: '蒜蓉烤生蚝', short: '烤生蚝', cat: 'bbq', spice: 1, price: 38, emoji: '🦪', desc: '蒜蓉铺满，蚝肉肥美', flavor: '鲜香', protein: '海鲜', style: '炸烤' },
  { id: 'bb9', name: '烤韭菜', short: '烤韭菜', cat: 'bbq', spice: 0, price: 12, emoji: '🌿', desc: '烤到微焦，撒孜然', flavor: '咸香', protein: '素食', style: '炸烤' },
  { id: 'bb10', name: '烤鸡皮', short: '烤鸡皮', cat: 'bbq', spice: 2, price: 18, emoji: '🍢', desc: '焦脆冒油，一串不够', flavor: '香辣', protein: '鸡肉', style: '炸烤' },

  /* 炸鸡汉堡 +3 */
  { id: 'b8', name: '鳕鱼堡', short: '鳕鱼堡', cat: 'burger', spice: 0, price: 28, emoji: '🐟', desc: '外酥里嫩，塔塔酱解腻', flavor: '咸香', protein: '海鲜', style: '炸烤' },
  { id: 'b9', name: '鸡块套餐', short: '鸡块套餐', cat: 'burger', spice: 1, price: 26, emoji: '🍗', desc: '鸡块配薯条，追剧标配', flavor: '咸香', protein: '鸡肉', style: '炸烤' },
  { id: 'b10', name: '培根蛋堡', short: '培根蛋堡', cat: 'burger', spice: 0, price: 26, emoji: '🥓', desc: '培根煎蛋，早餐感拉满', flavor: '咸香', protein: '猪肉', style: '炸烤' },

  /* 披萨意面 +4 */
  { id: 'pz7', name: '夏威夷披萨', short: '夏威夷', cat: 'pizza', spice: 0, price: 48, emoji: '🍍', desc: '菠萝配火腿，甜咸党争议款', flavor: '酸甜', protein: '猪肉', style: '炸烤' },
  { id: 'pz8', name: '芝士焗饭', short: '芝士焗饭', cat: 'pizza', spice: 0, price: 35, emoji: '🧀', desc: '芝士拉丝，饭粒裹满奶香', flavor: '咸香', protein: '素食', style: '炸烤' },
  { id: 'pz9', name: '肉酱千层面', short: '千层面', cat: 'pizza', spice: 0, price: 45, emoji: '🍝', desc: '一层肉酱一层面，叉子切下去', flavor: '酸甜', protein: '牛肉', style: '炸烤' },
  { id: 'pz10', name: '蒜香面包', short: '蒜香面包', cat: 'pizza', spice: 0, price: 18, emoji: '🥖', desc: '蒜香黄油，边角烤得脆', flavor: '咸香', protein: '素食', style: '炸烤' },

  /* 日料 +4 */
  { id: 'jp1', name: '亲子丼', short: '亲子丼', cat: 'japanese', spice: 0, price: 38, emoji: '🍚', desc: '滑蛋鸡肉盖饭，甜咸酱汁', flavor: '咸香', protein: '鸡肉', style: '干香' },
  { id: 'jp2', name: '咖喱猪排饭', short: '咖喱猪排', cat: 'japanese', spice: 1, price: 42, emoji: '🍛', desc: '猪排酥脆，咖喱浓稠', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'jp3', name: '味噌汤定食', short: '味噌定食', cat: 'japanese', spice: 0, price: 45, emoji: '🍱', desc: '烤鱼、米饭、味噌汤，清淡', flavor: '清淡', protein: '海鲜', style: '干香' },
  { id: 'jp4', name: '章鱼小丸子', short: '章鱼丸子', cat: 'japanese', spice: 0, price: 22, emoji: '🐙', desc: '外脆内软，木鱼花会跳舞', flavor: '咸香', protein: '海鲜', style: '炸烤' },

  /* 韩餐 +4 */
  { id: 'kr6', name: '韩式拌冷面', short: '拌冷面', cat: 'korean', spice: 1, price: 26, emoji: '🍜', desc: '甜辣酱拌冷面，越吃越凉快', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'kr7', name: '芝士年糕', short: '芝士年糕', cat: 'korean', spice: 2, price: 30, emoji: '🧀', desc: '芝士拉丝，年糕软糯', flavor: '香辣', protein: '素食', style: '小炒' },
  { id: 'kr8', name: '韩式烤五花', short: '烤五花', cat: 'korean', spice: 1, price: 55, emoji: '🥓', desc: '生菜包肉，配蒜片和酱', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'kr9', name: '大酱汤', short: '大酱汤', cat: 'korean', spice: 0, price: 32, emoji: '🍲', desc: '大酱咸鲜，豆腐土豆管饱', flavor: '咸香', protein: '素食', style: '汤汤水水' },

  /* 东南亚 +4 */
  { id: 'se7', name: '泰式绿咖喱', short: '绿咖喱', cat: 'sea', spice: 2, price: 42, emoji: '🍛', desc: '椰香绿咖喱，辣得温柔', flavor: '香辣', protein: '鸡肉', style: '干香' },
  { id: 'se8', name: '越南春卷', short: '越南春卷', cat: 'sea', spice: 0, price: 26, emoji: '🌯', desc: '米纸卷虾仁，蘸鱼露', flavor: '清淡', protein: '海鲜', style: '凉食' },
  { id: 'se9', name: '新加坡叻沙', short: '叻沙', cat: 'sea', spice: 2, price: 38, emoji: '🍜', desc: '椰浆咖喱汤，米粉吸满', flavor: '香辣', protein: '海鲜', style: '汤汤水水' },
  { id: 'se10', name: '泰式烤鸡', short: '泰式烤鸡', cat: 'sea', spice: 1, price: 36, emoji: '🍗', desc: '香茅腌过，皮脆肉嫩', flavor: '酸甜', protein: '鸡肉', style: '炸烤' },

  /* 川湘菜 +4 */
  { id: 'sc7', name: '回锅肉', short: '回锅肉', cat: 'sichuan', spice: 2, price: 38, emoji: '🥓', desc: '灯盏窝的肥肉，蒜苗爆香', flavor: '香辣', protein: '猪肉', style: '小炒' },
  { id: 'sc8', name: '鱼香茄子', short: '鱼香茄子', cat: 'sichuan', spice: 1, price: 26, emoji: '🍆', desc: '茄子软糯，鱼香汁拌饭', flavor: '酸甜', protein: '素食', style: '小炒' },
  { id: 'sc9', name: '酸菜鱼', short: '酸菜鱼', cat: 'sichuan', spice: 2, price: 48, emoji: '🐟', desc: '酸菜开胃，鱼片滑嫩', flavor: '酸爽', protein: '海鲜', style: '汤汤水水' },
  { id: 'sc10', name: '宫保鸡丁', short: '宫保鸡丁', cat: 'sichuan', spice: 1, price: 35, emoji: '🥜', desc: '花生鸡丁，糊辣荔枝味', flavor: '酸甜', protein: '鸡肉', style: '小炒' },

  /* 粤菜烧腊 +4 */
  { id: 'ct5', name: '豉油鸡饭', short: '豉油鸡', cat: 'cantonese', spice: 0, price: 30, emoji: '🍗', desc: '豉油香浸到骨头，配姜葱', flavor: '咸香', protein: '鸡肉', style: '干香' },
  { id: 'ct6', name: '叉烧包', short: '叉烧包', cat: 'cantonese', spice: 0, price: 16, emoji: '🥟', desc: '开花的包子，甜咸叉烧馅', flavor: '酸甜', protein: '猪肉', style: '蒸煮' },
  { id: 'ct7', name: '艇仔粥', short: '艇仔粥', cat: 'cantonese', spice: 0, price: 18, emoji: '🥣', desc: '鱼片花生油条，粥底绵', flavor: '清淡', protein: '海鲜', style: '汤汤水水' },
  { id: 'ct8', name: '咕噜肉', short: '咕噜肉', cat: 'cantonese', spice: 0, price: 36, emoji: '🍖', desc: '外脆里嫩，菠萝解腻', flavor: '酸甜', protein: '猪肉', style: '炸烤' },

  /* 轻食 +4 */
  { id: 'lt1', name: '烤鸡胸蔬菜碗', short: '烤鸡胸碗', cat: 'light', spice: 0, price: 34, emoji: '🥗', desc: '鸡胸不柴，南瓜很甜', flavor: '清淡', protein: '鸡肉', style: '凉食' },
  { id: 'lt2', name: '烟熏三文鱼沙拉', short: '三文鱼沙拉', cat: 'light', spice: 0, price: 42, emoji: '🥗', desc: '烟熏味配油醋汁，很清爽', flavor: '清淡', protein: '海鲜', style: '凉食' },
  { id: 'lt3', name: '全麦鸡蛋三明治', short: '鸡蛋三明治', cat: 'light', spice: 0, price: 24, emoji: '🥪', desc: '全麦面包夹厚蛋，简单', flavor: '清淡', protein: '素食', style: '凉食' },
  { id: 'lt4', name: '奇亚籽酸奶杯', short: '酸奶杯', cat: 'light', spice: 0, price: 20, emoji: '🥛', desc: '酸奶加奇亚籽，饱腹感强', flavor: '酸甜', protein: '素食', style: '凉食' },

  /* 早餐 +4 */
  { id: 'bf7', name: '小馄饨', short: '小馄饨', cat: 'breakfast', spice: 0, price: 14, emoji: '🥟', desc: '皮薄如纸，汤里撒葱花', flavor: '清淡', protein: '猪肉', style: '汤汤水水' },
  { id: 'bf8', name: '豆腐脑', short: '豆腐脑', cat: 'breakfast', spice: 0, price: 8, emoji: '🥣', desc: '咸口豆腐脑，浇卤汁', flavor: '咸香', protein: '素食', style: '蒸煮' },
  { id: 'bf9', name: '鸡蛋灌饼', short: '鸡蛋灌饼', cat: 'breakfast', spice: 0, price: 12, emoji: '🫓', desc: '蛋液灌进饼里，刷甜面酱', flavor: '咸香', protein: '素食', style: '炸烤' },
  { id: 'bf10', name: '手抓饼', short: '手抓饼', cat: 'breakfast', spice: 0, price: 10, emoji: '🫓', desc: '加蛋加肠，层层酥脆', flavor: '咸香', protein: '素食', style: '炸烤' },

  /* 饺子包子 +4 */
  { id: 'dp7', name: '三鲜饺子', short: '三鲜饺子', cat: 'dumpling', spice: 0, price: 24, emoji: '🥟', desc: '虾仁韭菜鸡蛋，鲜得很', flavor: '鲜香', protein: '海鲜', style: '蒸煮' },
  { id: 'dp8', name: '牛肉大葱饺子', short: '牛肉饺子', cat: 'dumpling', spice: 0, price: 26, emoji: '🥟', desc: '牛肉馅扎实，葱香足', flavor: '咸香', protein: '牛肉', style: '蒸煮' },
  { id: 'dp9', name: '素三鲜包子', short: '素三鲜包', cat: 'dumpling', spice: 0, price: 12, emoji: '🥟', desc: '青菜香菇粉丝，清爽', flavor: '咸香', protein: '素食', style: '蒸煮' },
  { id: 'dp10', name: '锅贴饺', short: '锅贴饺', cat: 'dumpling', spice: 0, price: 18, emoji: '🥟', desc: '煎到底脆，蘸醋更好吃', flavor: '咸香', protein: '猪肉', style: '炸烤' },

  /* 小吃卤味 +4 */
  { id: 'sk6', name: '炸鸡锁骨', short: '鸡锁骨', cat: 'snack', spice: 2, price: 20, emoji: '🍗', desc: '越啃越香，追剧杀手', flavor: '香辣', protein: '鸡肉', style: '炸烤' },
  { id: 'sk7', name: '卤藕片', short: '卤藕片', cat: 'snack', spice: 0, price: 10, emoji: '🥬', desc: '脆藕吸卤汁，微甜', flavor: '咸香', protein: '素食', style: '凉食' },
  { id: 'sk8', name: '烤肠', short: '烤肠', cat: 'snack', spice: 0, price: 6, emoji: '🌭', desc: '外皮爆开，刷甜辣酱', flavor: '咸香', protein: '猪肉', style: '炸烤' },
  { id: 'sk9', name: '狼牙土豆', short: '狼牙土豆', cat: 'snack', spice: 2, price: 12, emoji: '🥔', desc: '波浪土豆条，撒辣椒面', flavor: '香辣', protein: '素食', style: '炸烤' },

  /* 甜品饮品 +4 */
  { id: 'ds7', name: '手打柠檬茶', short: '柠檬茶', cat: 'dessert', spice: 0, price: 12, emoji: '🍋', desc: '手打柠檬，酸得清醒', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds8', name: '生椰拿铁', short: '生椰拿铁', cat: 'dessert', spice: 0, price: 18, emoji: '☕', desc: '椰乳配浓缩，冰的最好喝', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds9', name: '芒果冰沙', short: '芒果冰沙', cat: 'dessert', spice: 0, price: 18, emoji: '🥭', desc: '芒果肉打碎，冰沙很细', flavor: '酸甜', protein: '素食', style: '凉食' },
  { id: 'ds10', name: '黑糖珍珠鲜奶', short: '黑糖鲜奶', cat: 'dessert', spice: 0, price: 18, emoji: '🥛', desc: '黑糖挂壁，珍珠温热', flavor: '酸甜', protein: '素食', style: '凉食' },

];
