import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "近期状态",

	// 公告内容
	content: "5.21: 刚刚更换完blog主题， 文章搬迁完毕！需要压缩一些图片的大小，节约资源空间。处于神游的状态...",

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
