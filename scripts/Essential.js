/*
 * Essential.js for Clash by Hako
 * by Masstone
 * 
 * 洁癖热插拔脚本,不接管配置和规则,仅做当前配置优化补充
 * 保持UI上调控灵活性的同时节省掉不必要的编辑动作
 * App内置规则已包含大量可扩展规则集,配合使用无限扩展极度灵活
 *
 * 当前功能：
 * 1. 过滤无效节点（含去广告/客户端/修改/订阅/到期/流量/剩余/续费/请每月更新/更换客户端/ios-小火箭/ipv6免流 等）
 * 2. 根据实际节点生成地区组
 * 3. 自动给自定义规则生成的策略组添加地区和单节点
 * 4. tun开启mips stack
 */

function main(config) {
	if (!Array.isArray(config.proxies) || config.proxies.length === 0) {
		return config;
	}
	
	//过滤无效节点

	const excludeKeywords = /官网|重置|套餐|到期|过期|流量|剩余|续费|时间|产品|客服|非法|地址|Expire|Traffic|去广告|客户端|修改|订阅|请每月|每月更.?新|更新.*订阅|更换客户端|客户端已过时|客户端太旧|请更换|新版.*客户端|clashmeta客户端|clashverge客户端|shadowrocket客户端|小火箭客户端|ios-小火箭|安卓-|安卓客户端|电脑-|win电脑|macos-|ipv6免流|免流.*host|教程.*有下载|占位|测试节点|失效|停用|维护中/i;
	const validProxies = (config.proxies || []).filter(proxy => {
		if (!proxy || !proxy.name) return false;
		if (excludeKeywords.test(proxy.name)) return false;
		// if (proxy.type === 'ss') return false;
		return true;
	});
	config.proxies = validProxies;
	const validProxyNames = validProxies.map(p => p.name);
	if (validProxyNames.length === 0) return config;

	// 节点按地区分组
	const hkProxies = validProxyNames.filter(name => /香港|HK|HongKong/i.test(name));
	const twProxies = validProxyNames.filter(name => /台|新北|彰化|TW|Taiwan/i.test(name));
	const sgProxies = validProxyNames.filter(name => /新加坡|坡|狮城|SG|Singapore/i.test(name));
	const jpProxies = validProxyNames.filter(name => /日本|JP|Japan/i.test(name));
	const usProxies = validProxyNames.filter(name => /美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States/i.test(name));
	const krProxies = validProxyNames.filter(name => /首尔|韩|韓|KR|Korea|KOR/i.test(name));

	// 定义新策略组
	const customRegionGroups = [
		{
			name: "🇭🇰 香港节点",
			type: "url-test",
			url: "http://www.gstatic.com/generate_204",
			interval: 300,
			// 如果匹配到了香港节点就使用，没有就退回全量有效节点，防止组为空报错
			proxies: hkProxies.length > 0 ? hkProxies : validProxyNames
		},
		{
			name: "🇨🇳 台湾节点",
			type: "url-test",
			url: "http://www.gstatic.com/generate_204",
			interval: 300,
			proxies: twProxies.length > 0 ? twProxies : validProxyNames
		},
		{
			name: "🇸🇬 狮城节点",
			type: "url-test",
			url: "http://www.gstatic.com/generate_204",
			interval: 300,
			// 如果匹配到了香港节点就使用，没有就退回全量有效节点，防止组为空报错
			proxies: sgProxies.length > 0 ? sgProxies : validProxyNames
		},
		{
			name: "🇯🇵 日本节点",
			type: "url-test",
			url: "http://www.gstatic.com/generate_204",
			interval: 300,
			proxies: jpProxies.length > 0 ? jpProxies : validProxyNames
		},
		{
			name: "🇺🇸 美国节点",
			type: "url-test",
			url: "http://www.gstatic.com/generate_204",
			interval: 300,
			proxies: usProxies.length > 0 ? usProxies : validProxyNames
		},
		{
			name: "🇰🇷 韩国节点",
			type: "url-test",
			url: "http://www.gstatic.com/generate_204",
			interval: 300,
			proxies: krProxies.length > 0 ? krProxies : validProxyNames
		}
	];

	// 非破坏性合并策略组 (Merge Groups)

	const customRegionGroupNames = customRegionGroups.map(g => g.name);
	const originalGroups = Array.isArray(config['proxy-groups']) ? config['proxy-groups'] : [];
	const originalGroupNames = new Set(originalGroups.map(g => g.name));
	const updatedOriginalGroups = originalGroups.map(group => {
		if (group.type === 'select') {
			const origProxies = Array.isArray(group.proxies) ? group.proxies : [];
			if (customRegionGroupNames.includes(group.name)) {
				return group;
			}

			const headProxies = [];
			const tailProxies = [];

			origProxies.forEach(item => {
				const isSpecialKeyword = /^(PROXY|DIRECT|AUTO|REJECT|GLOBAL|节点选择|漏网之鱼)$/i.test(item);
				const isNestedGroup = originalGroupNames.has(item);

				if (isSpecialKeyword || isNestedGroup) {
					headProxies.push(item);
				} else {
					tailProxies.push(item);
				}
			});
			
			if (tailProxies.length === 0) {
				tailProxies.push(...validProxyNames);
			}

			// 三层层级结构：[ 1. 控制/嵌套组 ] + [ 2. 新地区组 ] + [ 3. 零散单节点 ]
			const reorderedProxies = [
				...headProxies,
				...customRegionGroupNames,
				...tailProxies
			];

			return {
				...group,
				proxies: Array.from(new Set(reorderedProxies)) // 去重保持顺序
			};
		}
		return group;
	});

	config['proxy-groups'] = [...updatedOriginalGroups, ...customRegionGroups];

	// 启动MIPs Stack
	const originalTun = config.tun || {};
	// 组合/替换 tun 模块
	config.tun = {
		...originalTun,
		// 保留原有 tun 的所有属性
		enable: true,
		// 写入/覆写指定的属性
		stack: 'mips',
		'auto-route': true,
		'strict-route': true,
		'auto-redirect': true,
		'auto-detect-interface': true,
		'dns-hijack': ['any:53', 'tcp://any:53'],
	};
	return config;
}