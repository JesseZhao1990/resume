受strml.net项目和黄轶老师的resume项目启发，实现react版的resume

https://jessezhao1990.github.io/resume/


### 如何使用本项目部署你自己的在线简历

#### 1. 书写简历
在src文件夹里面有个config文件夹，config文件夹下面有个work.txt。 此文件即是简历文件，改此文件，书写你的简历。

#### 2. 部署项目

fork本仓库，然后克隆你fork的仓库到你的本地，运行以下的命令

```
npm install
npm run deploy
```
即可将你的项目部署到自己的GitHub pages。

当然，你也可以部署到自己的任意服务器上，运行 *npm run build* 生成build之后的文件，用一个Nginx作为静态资源服务器


如果有任何关于本项目和部署相关的疑问，你可以在[issue](https://github.com/JesseZhao1990/resume/issues)里提问。我会进一步补充文档