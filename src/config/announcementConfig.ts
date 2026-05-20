import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "近期状态",

	// 公告内容
	content: "5.20: 人果然还是要好好照顾自己的身体。刚刚更换完blog主题， 文章搬迁ing...",

	// 是否允许用户关闭公告
	closable: false,

	link: {
		// 启用链接
		enable: false,
		// 链接文本
		text: "了解更多",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
