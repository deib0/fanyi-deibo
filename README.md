通过调用百度翻译的API，运用ts,node等制作命令行翻译工具

如何编译ts

```
yarn global add typescript// 第一步
tsc --init// 第二步，呼出tsconfig.json文件
"outDir": "dist",// 将该项修改为dist
tsc -p .// 编译完成
```