/* 盲盒外卖 · 菜品库
 * 想加菜？照着下面的格式往 DISHES 里加一行就行。
 * spice: 0 不辣 / 1 微辣 / 2 正常辣 / 3 加辣
 */
const CATEGORIES = [
  { id: 'rice', name: '饭', emoji: '🍚', color: '#FFE3C9' },
  { id: 'noodle', name: '面', emoji: '🍜', color: '#FFF1BF' },
  { id: 'fen', name: '粉', emoji: '🍲', color: '#E6F2D9' },
  { id: 'mixian', name: '米线', emoji: '🥘', color: '#D9F0EA' },
  { id: 'malatang', name: '麻辣烫', emoji: '🌶️', color: '#FFD9D1' },
  { id: 'burger', name: '汉堡', emoji: '🍔', color: '#FFE0C2' },
  { id: 'japanese', name: '日料', emoji: '🍣', color: '#E5E0FA' },
  { id: 'light', name: '轻食', emoji: '🥗', color: '#DFF3D8' },
];

const SPICE_LABELS = ['不辣', '微辣', '正常辣', '加辣'];

const DISHES = [
  /* ---------- 饭 ---------- */
  { id: 'r1', name: '黄焖鸡米饭', short: '黄焖鸡', cat: 'rice', spice: 2, price: 26, emoji: '🍗', desc: '酱汁拌饭，土豆比鸡还好吃' },
  { id: 'r2', name: '番茄炒蛋盖饭', short: '番茄炒蛋', cat: 'rice', spice: 0, price: 18, emoji: '🍅', desc: '酸甜下饭，永远的安全牌' },
  { id: 'r3', name: '鱼香肉丝盖饭', short: '鱼香肉丝', cat: 'rice', spice: 1, price: 22, emoji: '🥢', desc: '一勺汁能干掉半碗饭' },
  { id: 'r4', name: '咖喱鸡排饭', short: '咖喱鸡排', cat: 'rice', spice: 1, price: 28, emoji: '🍛', desc: '金黄浓稠，配一块脆鸡排' },
  { id: 'r5', name: '台式卤肉饭', short: '卤肉饭', cat: 'rice', spice: 0, price: 22, emoji: '🍖', desc: '肥瘦相间，卤汁浸透米饭' },
  { id: 'r6', name: '扬州炒饭', short: '炒饭', cat: 'rice', spice: 0, price: 20, emoji: '🍚', desc: '粒粒分明，虾仁火腿都有' },
  { id: 'r7', name: '麻婆豆腐盖饭', short: '麻婆豆腐', cat: 'rice', spice: 2, price: 20, emoji: '🌶️', desc: '麻辣烫嘴，就是停不下来' },
  { id: 'r8', name: '石锅拌饭', short: '拌饭', cat: 'rice', spice: 1, price: 28, emoji: '🍳', desc: '锅巴焦香，拌开那一刻最治愈' },
  { id: 'r9', name: '腊味煲仔饭', short: '煲仔饭', cat: 'rice', spice: 0, price: 32, emoji: '🍲', desc: '腊肠油香渗进每一粒米' },
  { id: 'r10', name: '猪脚饭', short: '猪脚饭', cat: 'rice', spice: 0, price: 28, emoji: '🐷', desc: '软糯胶质，配一勺酸菜' },

  /* ---------- 面 ---------- */
  { id: 'n1', name: '兰州牛肉面', short: '牛肉面', cat: 'noodle', spice: 1, price: 24, emoji: '🍜', desc: '清汤萝卜，辣油自己加' },
  { id: 'n2', name: '重庆小面', short: '重庆小面', cat: 'noodle', spice: 3, price: 16, emoji: '🌶️', desc: '麻辣鲜香，早起一碗醒神' },
  { id: 'n3', name: '番茄鸡蛋面', short: '番茄鸡蛋面', cat: 'noodle', spice: 0, price: 18, emoji: '🍅', desc: '汤都能喝干净的家常味' },
  { id: 'n4', name: '老北京炸酱面', short: '炸酱面', cat: 'noodle', spice: 0, price: 20, emoji: '🥢', desc: '黄瓜丝配浓酱，拌到每根都上色' },
  { id: 'n5', name: '油泼面', short: '油泼面', cat: 'noodle', spice: 2, price: 22, emoji: '🔥', desc: '热油一泼，蒜香辣子香全出来' },
  { id: 'n6', name: '豚骨拉面', short: '豚骨拉面', cat: 'noodle', spice: 0, price: 36, emoji: '🍥', desc: '奶白汤底，叉烧入口即化' },
  { id: 'n7', name: '酸菜牛肉面', short: '酸菜牛肉面', cat: 'noodle', spice: 0, price: 26, emoji: '🥬', desc: '酸香开胃，牛肉给得实在' },
  { id: 'n8', name: '葱油拌面', short: '葱油拌面', cat: 'noodle', spice: 0, price: 16, emoji: '🧅', desc: '简单到极致，香到犯规' },

  /* ---------- 粉 ---------- */
  { id: 'f1', name: '螺蛳粉', short: '螺蛳粉', cat: 'fen', spice: 2, price: 22, emoji: '🍲', desc: '闻着上头，吃着更上头' },
  { id: 'f2', name: '桂林米粉', short: '桂林米粉', cat: 'fen', spice: 1, price: 18, emoji: '🍜', desc: '卤水香，锅烧脆' },
  { id: 'f3', name: '酸辣粉', short: '酸辣粉', cat: 'fen', spice: 3, price: 14, emoji: '🌶️', desc: '酸辣冲鼻，粉条滑溜' },
  { id: 'f4', name: '常德牛肉粉', short: '牛肉粉', cat: 'fen', spice: 1, price: 24, emoji: '🥩', desc: '红油汤底，牛肉大片' },
  { id: 'f5', name: '干炒牛河', short: '干炒牛河', cat: 'fen', spice: 0, price: 28, emoji: '🥡', desc: '镬气十足，油亮不腻' },
  { id: 'f6', name: '鸭血粉丝汤', short: '鸭血粉丝', cat: 'fen', spice: 1, price: 20, emoji: '🦆', desc: '汤鲜料足，冬天救命' },
  { id: 'f7', name: '湖南米粉', short: '湖南米粉', cat: 'fen', spice: 2, price: 20, emoji: '🌶️', desc: '剁椒盖顶，辣得痛快' },

  /* ---------- 米线 ---------- */
  { id: 'm1', name: '过桥米线', short: '过桥米线', cat: 'mixian', spice: 0, price: 32, emoji: '🍲', desc: '滚汤烫熟，仪式感拉满' },
  { id: 'm2', name: '小锅米线', short: '小锅米线', cat: 'mixian', spice: 2, price: 24, emoji: '🥘', desc: '酸辣浓汤，韭菜点睛' },
  { id: 'm3', name: '番茄肥牛米线', short: '肥牛米线', cat: 'mixian', spice: 0, price: 28, emoji: '🍅', desc: '酸甜汤底，肥牛管够' },
  { id: 'm4', name: '酸汤米线', short: '酸汤米线', cat: 'mixian', spice: 1, price: 26, emoji: '🥬', desc: '开胃酸香，越吃越顺' },
  { id: 'm5', name: '云南菌菇米线', short: '菌菇米线', cat: 'mixian', spice: 0, price: 30, emoji: '🍄', desc: '菌香清甜，汤头很鲜' },
  { id: 'm6', name: '辣子鸡米线', short: '辣子鸡', cat: 'mixian', spice: 3, price: 26, emoji: '🔥', desc: '干香辣子鸡，配汤刚好' },

  /* ---------- 麻辣烫 ---------- */
  { id: 'x1', name: '麻辣烫', short: '麻辣烫', cat: 'malatang', spice: 1, price: 28, emoji: '🥘', desc: '想吃什么自己夹，微辣刚好' },
  { id: 'x2', name: '麻辣拌', short: '麻辣拌', cat: 'malatang', spice: 2, price: 26, emoji: '🥡', desc: '无汤版麻辣烫，酱汁裹满' },
  { id: 'x3', name: '冒菜', short: '冒菜', cat: 'malatang', spice: 2, price: 32, emoji: '🍲', desc: '一个人的火锅，配米饭绝了' },
  { id: 'x4', name: '关东煮', short: '关东煮', cat: 'malatang', spice: 0, price: 18, emoji: '🍢', desc: '清淡暖胃，萝卜煮到透明' },
  { id: 'x5', name: '麻辣香锅', short: '麻辣香锅', cat: 'malatang', spice: 3, price: 45, emoji: '🌶️', desc: '重口快乐，配冰可乐' },
  { id: 'x6', name: '番茄麻辣烫', short: '番茄烫', cat: 'malatang', spice: 0, price: 30, emoji: '🍅', desc: '不吃辣也能拥有的麻辣烫' },

  /* ---------- 汉堡 ---------- */
  { id: 'b1', name: '香辣鸡腿堡', short: '鸡腿堡', cat: 'burger', spice: 2, price: 25, emoji: '🍔', desc: '外皮酥脆，辣味够劲' },
  { id: 'b2', name: '双层牛肉堡', short: '牛肉堡', cat: 'burger', spice: 0, price: 32, emoji: '🍔', desc: '两手抓着吃，肉汁横流' },
  { id: 'b3', name: '炸鸡桶', short: '炸鸡桶', cat: 'burger', spice: 1, price: 58, emoji: '🍗', desc: '快乐加倍，罪恶也加倍' },
  { id: 'b4', name: '薯条汉堡套餐', short: '汉堡套餐', cat: 'burger', spice: 0, price: 29, emoji: '🍟', desc: '经典组合，不会出错' },
  { id: 'b5', name: '鸡肉卷', short: '鸡肉卷', cat: 'burger', spice: 1, price: 18, emoji: '🌯', desc: '边走边吃，酱多到爆' },

  /* ---------- 日料 ---------- */
  { id: 'j1', name: '三文鱼刺身饭', short: '刺身饭', cat: 'japanese', spice: 0, price: 68, emoji: '🍣', desc: '厚切三文鱼，配芥末刚好' },
  { id: 'j2', name: '寿司拼盘', short: '寿司拼盘', cat: 'japanese', spice: 0, price: 88, emoji: '🍱', desc: '一次吃到八种口味' },
  { id: 'j3', name: '鳗鱼饭', short: '鳗鱼饭', cat: 'japanese', spice: 0, price: 78, emoji: '🍱', desc: '酱香蒲烧，甜咸交织' },
  { id: 'j4', name: '天妇罗乌冬', short: '天妇罗乌冬', cat: 'japanese', spice: 0, price: 42, emoji: '🍤', desc: '汤清面滑，天妇罗酥脆' },
  { id: 'j5', name: '刺身拼盘', short: '刺身拼盘', cat: 'japanese', spice: 0, price: 128, emoji: '🐟', desc: '发工资那天值得拥有' },
  { id: 'j6', name: '照烧鸡排饭', short: '照烧鸡', cat: 'japanese', spice: 0, price: 38, emoji: '🍗', desc: '甜咸照烧汁，拌饭一绝' },

  /* ---------- 轻食 ---------- */
  { id: 'l1', name: '鸡胸肉沙拉', short: '鸡肉沙拉', cat: 'light', spice: 0, price: 32, emoji: '🥗', desc: '清爽但不寡淡，酱汁另装' },
  { id: 'l2', name: '牛油果三明治', short: '牛油果三明治', cat: 'light', spice: 0, price: 28, emoji: '🥪', desc: '绵密牛油果，配全麦面包' },
  { id: 'l3', name: '藜麦能量碗', short: '藜麦碗', cat: 'light', spice: 0, price: 36, emoji: '🥣', desc: '五颜六色，吃完很轻盈' },
  { id: 'l4', name: '三文鱼波奇饭', short: '波奇饭', cat: 'light', spice: 0, price: 45, emoji: '🍣', desc: '海味配米饭，夏天首选' },
  { id: 'l5', name: '低卡鸡肉卷', short: '低卡鸡肉卷', cat: 'light', spice: 0, price: 26, emoji: '🌯', desc: '卷得扎实，热量友好' },
  { id: 'l6', name: '希腊酸奶碗', short: '酸奶碗', cat: 'light', spice: 0, price: 22, emoji: '🥛', desc: '莓果加坚果，甜得很克制' },
];
