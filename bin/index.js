#!/usr/bin/env node

const {program} = require('commander')
const pck = require('../package.json')
const {mkdirSync, existsSync} = require('fs')
const {remove, removeSync} = require('fs-extra')
const {join} = require('path')
const prompts = require('prompts')
const {spawn} = require('child_process')
const log = require('node-pretty-log');
const download = require('download-git-repo')

const clonePaht = 'JianTin/react-project-template#master'
let mkdirPath = '' // 创建文件的路径
let optionsResponse = '' // 选项返回值
let folderName = '' // 创建文件的名
const cwd = process.cwd()
const option = [
    {
        type: 'select',
        message: 'Language type',
        name: 'extension',
        choices: [
            {title: 'JavaScript', value: 'js'},
            {title: 'JavaScript + TypeScript', value: 'ts'}
        ],
        initial: 0
    },
    {
        type: 'toggle',
        name: 'IE',
        message: 'compatible IE (兼容IE) ?',
        active: 'yes',
        inactive: 'no'
    },
    {
        type: 'toggle',
        name: 'isMobile',
        message: 'adaptation mobile (适配移动端) ?',
        active: 'yes',
        inactive: 'no'
    },
    {
        type: prev=>prev === true ? 'number' : null,
        name: 'mobile',
        message: 'mobile size (设计稿尺寸)',
        initial: 750
    }
]

// 创建 和 git clone
async function createFn(name){
    folderName = name
    // 文件夹路径
    mkdirPath = join(cwd, name)
    // 如果文件夹存在
    if(existsSync(mkdirPath)){
        const {isCover} = await prompts({
            type: 'toggle',
            name: 'isCover',
            message: 'is cover dirFloder (是否覆盖文件夹) ?',
            active: 'yes',
            inactive: 'no',
            initial: true
        })
        // 覆盖 那么删除
        if(isCover) removeSync(mkdirPath)
        // 否则退出
        if(!isCover) return
    }
    // 创建文件夹
    mkdirSync(mkdirPath)
    optionsResponse = await prompts(option)
    log('info', 'clone template start')
    download(`${clonePaht}`, folderName, cloneAfterOption)
}

// clone 失败处理
function cloneFail(error){
    console.log(`git clone fail Check the network. delete the folder ${folderName} Re-execute the command `)
    console.log(`git clone 失败，可能是网络问题。请删除文件夹 ${folderName}，重新执行命令 npx rough-react-cli name `)
    console.log(error)
}

// 处理 选项数据
function handelOptions(){
    if(!optionsResponse['mobile']) optionsResponse['mobile'] = 'false'
    return Object.keys(optionsResponse).reduce((prev, key)=>{
        if(key !== 'isMobile') prev.push(optionsResponse[key])
        return prev
    }, [])
}

// 运行子文件对 选项创建
function cloneAfterOption(error){
    if(error) return cloneFail(error)
    log('info', 'clone template end')
    log('info', 'reset options start')
    const argv = handelOptions()
    const runScriptPath = join(mkdirPath, '/optionScript/index.js')
    // 运行子程序
    spawn('node', [runScriptPath, ...argv], {
        shell: true
    })
        .on('close', (code)=>{
            if(code !== 0){
                log('error', 'reset options error')
                console.log(`node ${runScriptPath} ${argv.join(' ')}`)
            } else {
                log('info', 'reset options end')
            }
            console.log(`cd ${folderName}`)
            console.log(`npm install`)
            console.log('npm run dev')
        })
    // 删除git相关
    remove(join(mkdirPath, '/.git'))
    remove(join(mkdirPath, '/.gitignore'))
}

async function main(){
    program
        .version(pck.version)
        .argument('[name]', 'create app name', (name)=>name, 'app')
        .action(createFn)
    await program.parseAsync(process.argv)
}

main()