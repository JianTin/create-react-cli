#!/usr/bin/env node

const {program} = require('commander')
const pck = require('../package.json')
const {mkdirSync} = require('fs')
const {remove} = require('fs-extra')
const {join} = require('path')
const prompts = require('prompts')
const {spawn} = require('child_process')
const log = require('node-pretty-log');
const download = require('download-git-repo')

const clonePaht = 'JianTin/react-project-template#master'
let mkdirPath = ''
let optionsResponse = ''
let folderName = ''
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
    }
]

async function createFn(name){
    folderName = name
    // 文件夹路径
    mkdirPath = join(cwd, name)
    // 创建文件夹
    mkdirSync(mkdirPath)
    optionsResponse = await prompts(option)
    log('info', 'clone template start')
    download(`${clonePaht}`, folderName, cloneAfterOption)
}
// 运行子文件对 选项创建
function cloneAfterOption(error){
    if(error) {
        console.log(`git clone fail Check the network. delete the folder ${folderName} Re-execute the command `)
        console.log(`git clone 失败，可能是网络问题。请删除文件夹 ${folderName}，重新执行命令 npx rough-react-cli name `)
        console.log(error)
        return
    }
    log('info', 'clone template end')
    log('info', 'reset options start')
    const argv = Object.values(optionsResponse)
    const runScriptPath = join(mkdirPath, '/optionScript/index.js')
    // 运行子程序
    spawn('node', [runScriptPath, ...argv])
        .on('close', ()=>{
            log('info', 'reset options end')
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