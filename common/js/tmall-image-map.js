/**
 * 天猫/淘宝小程序图片映射表
 * 将本地图片文件名映射到天猫 CDN URL
 *
 * 使用方法：
 * import { getTmallImageUrl } from '@/common/js/tmall-image-map.js';
 * const url = getTmallImageUrl('白水晶圆珠.png');
 */

// 图片名称 -> 天猫 CDN URL 映射表
const imageMap = {
	// === 配件类图片 ===
	'沙金烧蓝十二生肖-马.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01GhH0N11ricq9Vlj25_!!187475665.png',
	'沙金烧蓝十二生肖-羊.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01Ye2ONZ1ricq9BfDni_!!187475665.png',
	'沙金烧蓝十二生肖-牛.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01UmlHHp1ricqAQdNb7_!!187475665.png',
	'沙金烧蓝-对称祥云.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN012UukJB1ricq9VHkAF_!!187475665.png',
	'沙金莲蓬樱桃红葫芦南红玛瑙滴溜.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01QrTE2Y1ricq9TeOWN_!!187475665.png',
	'沙金古法烧蓝铜钱.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01lKrgIV1ricq9TgPFW_!!187475665.png',
	'南红隔珠荔枝冻蝴蝶滴溜.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN013ztox11ricq9ThD8o_!!187475665.png',
	'南红隔珠6mm粉色兰花滴溜.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01ZDz0NM1ricq94Os74_!!187475665.png',
	'绿松石隔片磨砂.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01Ly3KUu1ricq8tC6bG_!!187475665.png',
	'镂空银色隔珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01P9flef1ricq9caPMa_!!187475665.png',
	'镂空爱心银色隔珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01Sn751I1ricq9TfOqe_!!187475665.png',
	'荔枝冻玛瑙莲蓬滴溜.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01m4ps931ricq8tCEoF_!!187475665.png',
	'景泰蓝莲花隔珠10mm.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01GME2F01ricq9DEUQO_!!187475665.png',
	'景泰蓝莲花隔珠8mm.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01YEQPPM1ricq9VFWpA_!!187475665.png',
	'金色花生吊坠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01WQSKBx1ricq8X0lGC_!!187475665.png',
	'回形纹环形银色四叶草隔珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01qmLDiD1ricq9VDBFH_!!187475665.png',
	'回形纹环形银色花纹爱心隔珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01ZOfSTA1ricq9DDDMy_!!187475665.png',
	'灰月光圆珠滴溜.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01DJRMkY1ricq9Td7HZ_!!187475665.png',
	'灰玛瑙莲蓬提溜.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01z1nekK1ricq9ViZH5_!!187475665.png',
	'黄玛瑙莲蓬滴溜.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01JdwLDB1ricq9HOFE9_!!187475665.png',
	'红玛瑙樱桃编绳滴溜.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN015UsHHt1ricq9DBff6_!!187475665.png',
	'和田玉镶金转运珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01JMwxa51ricq9cXr4r_!!187475665.png',
	'和田玉跑环.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01gc03r11ricq95Qjlg_!!187475665.png',
	'古法沙金福字小吊牌.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01IgshXy1ricq49ms7M_!!187475665.png',
	'仿珍珠跑环.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01vPKLGH1ricq9Ve0Sn_!!187475665.png',
	'大号银色锆石跑环隔珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01Dynsqc1ricq9VBAIw_!!187475665.png',
	'藏银太极八卦隔珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01RjrXMc1ricq8hTUEX_!!187475665.png',
	'藏银镂空祥云隔珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN017K0Vlz1ricq9O64JA_!!187475665.png',
	'藏银符文隔珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01QQxZxa1ricq8WyD5M_!!187475665.png',
	'藏银符文多变棱形隔珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01hbsGOM1ricq9HOe2W_!!187475665.png',
	'白玉莲蓬提溜.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01dVNIj91ricq95S0hQ_!!187475665.png',
	's925银竹子隔珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01FA0KYk1ricq9DAjKr_!!187475665.png',
	's925银兰花隔珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01S5E3jN1ricq9HMMeb_!!187475665.png',
	's925银镀金紫龙晶蛋面隔珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01ipS9YW1ricq9TY16w_!!187475665.png',
	's925银镀金石榴石隔珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN013Ilo7O1ricq9V7wdW_!!187475665.png',
	's925银镀金日光石隔珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01bqyM5P1ricq94IMJe_!!187475665.png',
	's925银镀金欧泊隔珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01IeL1a01ricq8pnHDS_!!187475665.png',
	's925银镀金黄绿碧玺小吊坠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01Ei1dMm1ricq95O3H4_!!187475665.png',
	's925银镀金和田玉转运珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01D9KVJO1ricq95QOnS_!!187475665.png',
	's925银镀金海蓝宝隔珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01JySuaI1ricq94HQ2r_!!187475665.png',
	's925银镀金粉红碧玺小吊坠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01lqUE5g1ricq8pkSWh_!!187475665.png',
	'紫水晶珍珠滴溜.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01pACVgW1ricq8WjJ12_!!187475665.png',
	'银色跑环小铃铛.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01BtYh691ricq9BiApG_!!187475665.png',
	'羊脂白玉南瓜提溜.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN016iwyGn1ricq49Vt1f_!!187475665.png',
	'小号银色锆石跑环隔珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01jqFPg01ricq9Uti5D_!!187475665.png',
	'西瓜粉晶天然珍珠滴溜.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01r2J59X1ricq8Wjhux_!!187475665.png',
	'微镶锆石车轮钻圈隔片.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01IpxHUQ1ricq9Uqxa5_!!187475665.png',
	'天然菩提桃木滴溜.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01IbplMV1ricq8WhYrk_!!187475665.png',
	'素银十字架.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN017aaVDL1ricq8WiMkV_!!187475665.png',
	'15mm藏银复古花纹隔珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01DE6ksG1ricq8paiqO_!!187475665.png',
	'13mm藏银复古花纹隔珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01dNknxh1ricq9TMCT7_!!187475665.png',

	// === SKU 编号图片（配件） ===
	'A2602S9241.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01eP3vDt1ricq9TY0yW_!!187475665.png',
	'A2602S9235.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN018gxQjs1ricq8hPOP5_!!187475665.png',
	'A2602S9234.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01VL5dsO1ricq95P7ij_!!187475665.png',
	'A2602S9232.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01Q1gXFG1ricq8hOmxO_!!187475665.png',
	'A2602S9230.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01jVHOhz1ricq9VdCJn_!!187475665.png',
	'A2602S9228.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01P74RBU1ricq9TVGS6_!!187475665.png',
	'A2602S9227.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01vwfWmf1ricq9TVSuR_!!187475665.png',
	'A2602S9224.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01G3ISw91ricq9BtilD_!!187475665.png',
	'A2602S9223.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01Sz9irJ1ricq9TW8Sb_!!187475665.png',
	'A2602S9221.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN018I9fGy1ricqAQoj09_!!187475665.png',
	'A2602S9220.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01G98Itm1ricq9VZJ4n_!!187475665.png',
	'A2602S6229.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01UJ82IK1ricq9cSkhG_!!187475665.png',
	'A2602S5237.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01Bz1VOy1ricq9VZEqA_!!187475665.png',
	'A2602S2250.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01CkqSG91ricqAQpKJG_!!187475665.png',
	'A2602S2249.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01hJ4i0N1ricq9cOK6r_!!187475665.png',
	'A2602S2248.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01BCfy9D1ricq9VXxpV_!!187475665.png',
	'A2602S2247.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN011XPvsm1ricq9cOOEl_!!187475665.png',
	'A2602S2246.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01DiQ3lb1ricq94CaGr_!!187475665.png',
	'A2602S2245.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01ccH7et1ricq9V2N3m_!!187475665.png',
	'A2602S2244.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01IHQlkG1ricq95HwRb_!!187475665.png',
	'A2602S2243.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01gvO0oA1ricq94CJbn_!!187475665.png',
	'A2602S2242.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01RKfi2r1ricq94CW48_!!187475665.png',
	'A2602S2240.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01GbaXSM1ricq95ITfB_!!187475665.png',
	'A2602S2239.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01y3RNQF1ricq8sxsCF_!!187475665.png',
	'A2602S2238.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01QiIo4p1ricq8WpLjl_!!187475665.png',
	'A2602S2233.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01EIgNDR1ricq9HG7Ra_!!187475665.png',
	'A2602S2222.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN010WBdu71ricq9HEmGz_!!187475665.png',
	'A2602S1236.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01jOTrKO1ricq9VWU6A_!!187475665.png',
	'A2602S1225.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01xHEp181ricq9VWYEe_!!187475665.png',
	'A2602K3214.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01oSGNct1ricq9cJHvl_!!187475665.png',
	'A2602K3213.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01rDTdrp1ricq9HCpXZ_!!187475665.png',
	'A2602K3212.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01bnN4f91ricqAQkI8s_!!187475665.png',
	'A2602K3211.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01imsY9t1ricq9UwKa8_!!187475665.png',
	'A2602K3210.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01QrS2i91ricq948YYH_!!187475665.png',
	'A2602K3209.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01sQHAlF1ricq9NsuYI_!!187475665.png',
	'A2602K3208.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN012ElbBU1ricq8hGbC5_!!187475665.png',
	'A2602K3207.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01heyaou1ricq9TOsrk_!!187475665.png',
	'A2602K3206.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01qxeDYQ1ricq9D0WbI_!!187475665.png',
	'A2602K3205.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01qrB6H41ricq9TNkCA_!!187475665.png',
	'A2602K3204.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01larZ7S1ricq945wLV_!!187475665.png',
	'A2602K3203.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01PzL42y1ricq9Uwvqw_!!187475665.png',
	'A2602K3202.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN019ql5Da1ricqAQi8yF_!!187475665.png',
	'A2602K3201.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01gzewqk1ricq9cFzzk_!!187475665.png',
	'A2602K3200.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01Xjzo9j1ricq9cH0Mv_!!187475665.png',
	'A2602K3199.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01MLRvNU1ricq9cFKNt_!!187475665.png',
	'A2602K3198.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01XSHLlp1ricq946oHX_!!187475665.png',
	'A2602K3197.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01d1mUXE1ricq9TN4X9_!!187475665.png',
	'A2602K3215.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01d1mUXE1ricq9TN4X9_!!187475665.png',

	// === 珠子类图片 ===
	'白水晶圆珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01OSONPI1ricq8XXn2v_!!187475665.png',
	'白玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01lwFYp81ricq4AMFg9_!!187475665.png',
	'白阿赛.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01A2r59q1ricq8XXWOq_!!187475665.png',
	'白月光.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01nV3W921ricq9Vjjqy_!!187475665.png',
	'深色乌拉圭紫水晶.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01liEUGZ1ricq94yv6H_!!187475665.png',
	'浅色玻利维亚紫水晶.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01qu2CCn1ricq8XdA2u_!!187475665.png',
	'薰衣草紫水晶浅色.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01XUknJY1ricq9CeRoX_!!187475665.png',
	'柠檬黄黄水晶.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01Kk4oJC1ricq9UEz0s_!!187475665.png',
	'巴西黄黄水晶.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01gUun321ricq9d4x9M_!!187475665.png',
	'星光马粉.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01HyU2jy1ricq9DqUBD_!!187475665.png',
	'冰种粉水晶.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01FiNjFE1ricq9DkmMe_!!187475665.png',
	'茶水晶圆珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01gLXIAZ1ricq9Cakiz_!!187475665.png',
	'满天星绿幽灵.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01Faoywu1ricq9WH0lY_!!187475665.png',
	'豆沙红草莓晶.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01YeIQk11ricq94t0t1_!!187475665.png',
	'鸽血红草莓晶.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01slRMYC1ricq9d7VKT_!!187475665.png',
	'黄阿赛.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01SHasTY1ricq9CaHmZ_!!187475665.png',
	'多宝兔毛晶.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN010w6heK1ricq9DlzIC_!!187475665.png',
	'红玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01OY2Z601ricq9Okoob_!!187475665.png',
	'绿玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01qX7uAq1ricq9d9zOv_!!187475665.png',
	'黄玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN013xKhG61ricq9Vksjo_!!187475665.png',
	'黑玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01RaXrvq1ricq9OkLet_!!187475665.png',
	'蓝玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01ZXWBOC1ricq9CcIex_!!187475665.png',
	'灰玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN010wAxpK1ricq9CdZYP_!!187475665.png',
	'原色玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01txXbLe1ricq9DqxKu_!!187475665.png',
	'樱桃红玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01fL6OcA1ricq94wyZh_!!187475665.png',
	'冰飘南红玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01Q7BFpL1ricq9UA5BY_!!187475665.png',
	'盐源玛瑙圆珠.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01qtMGUE1ricq9OnItG_!!187475665.png',
	'6A南红玛瑙柿子红圆珠.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01YzPN231ricq9DhUbp_!!187475665.png',
	'冰曜石.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01kc8OAS1ricq8thvOo_!!187475665.png',
	'金曜石.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01NALgCN1ricq9I0NTA_!!187475665.png',
	'银曜石.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01D99jRL1ricq9dCP8P_!!187475665.png',
	'黑曜石.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01OXDMXI1ricq9DkFEo_!!187475665.png',
	'绿葡萄石.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01wd2hBa1ricq9I3WvG_!!187475665.png',
	'蓝虎眼.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01qAibWO1ricq9OkcT5_!!187475665.png',
	'金虎眼.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01q9e33I1ricq9CdRFy_!!187475665.png',
	'黄虎眼.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01CfkXUP1ricq9Dn3wD_!!187475665.png',
	'红虎眼.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01awREdu1ricq9VjPF0_!!187475665.png',
	'青金石.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN010IQcqB1ricq9UHCGp_!!187475665.png',
	'灰月光.png': 'https://img.alicdn.com/imgextra/i3/187475665/O1CN01F6YSmX1ricq9VmDsX_!!187475665.png',
	'粉月光.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01x7UqjM1ricq9d9761_!!187475665.png',
	'酒红石榴石.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN017T82eM1ricq94ucsi_!!187475665.png',
	'橙红石榴石.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN015ZEH4Z1ricq9DlJfQ_!!187475665.png',
	'沙弗莱石苹果绿.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01XEg9jN1ricq9CduWZ_!!187475665.png',
	'5A海蓝宝.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN015t4d0g1ricq9DhMGl_!!187475665.png',
	'鸡油黄蜜蜡.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01fEI0xf1ricq8qQ53u_!!187475665.png',
	'晴水和田玉.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01kmhbro1ricq9WK1q1_!!187475665.png',
	'和田碧玉.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01IqaLpn1ricq8XasTZ_!!187475665.png',
	'和田白玉.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01VOUWXz1ricq8qM3VN_!!187475665.png',
	'和田玉.png': 'https://img.alicdn.com/imgextra/i4/187475665/O1CN01wgYm6i1ricq8XXzgt_!!187475665.png',
	'金丝檀木圆珠.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01ILzstq1ricq9Oj8wi_!!187475665.png',
	'朱砂.png': 'https://img.alicdn.com/imgextra/i2/187475665/O1CN01QPZGo01ricq9WL6RP_!!187475665.png',

	// === 兜底图片 ===
	'兜底图片.png': 'https://img.alicdn.com/imgextra/i1/187475665/O1CN01sl2vvN1ricq4AOOnw_!!187475665.png',
};

/**
 * 根据图片文件名获取天猫 CDN URL
 * @param {string} imageName - 图片文件名（如 '白水晶圆珠.png'）
 * @returns {string|null} - 天猫 CDN URL，如果未找到则返回 null
 */
export function getTmallImageUrl(imageName) {
	if (!imageName) return null;
	const name = String(imageName).trim();
	// 直接匹配
	if (imageMap[name]) {
		return imageMap[name];
	}
	// 尝试去掉路径只保留文件名
	const fileName = name.split('/').pop();
	if (imageMap[fileName]) {
		return imageMap[fileName];
	}
	// 尝试添加 .png 后缀
	if (!fileName.includes('.')) {
		const withPng = fileName + '.png';
		if (imageMap[withPng]) {
			return imageMap[withPng];
		}
	}
	return null;
}

/**
 * 检查图片是否有天猫 CDN 映射
 * @param {string} imageName - 图片文件名
 * @returns {boolean}
 */
export function hasTmallImage(imageName) {
	return getTmallImageUrl(imageName) !== null;
}

export default imageMap;
