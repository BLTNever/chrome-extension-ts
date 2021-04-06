import React, { StrictMode, useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import './popup.css'
import Request from './request'

const defaultList = [
    { label: 'aa', value: 'aa' },
    { label: 'bb', value: 'bb' },
    { label: 'cc', value: 'cc' },
]


const EXPIRE = 3600 * 24 * 30

interface Obj {
    [index: string]: any
}

const Popup = () => {
    const [info, setInfo] = useState<Obj>({
        aa: '', bb: '', cc: '', dd: ''
    })
    const [message, setMessage] = useState<String>('')
    const [_env, setEnv] = useState<String>('')
    const [currentURL, setCurrentURL] = useState('')

    const _init = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0]
            setCurrentURL(tab.url as string)
            if (tab.url?.indexOf('localhost')) {
                getLocal()
            }
        })
    }

    const getLocal = () => {
        if (!window.localStorage) return
        const { localStorage } = window
        const localCookie = localStorage.getItem('localCookie')
        if (localCookie?.length) {
            const obj = JSON.parse(localCookie)
            setInfo(obj)
        }
    }
    const setLocal = () => {
        if (!window.localStorage) return
        const { localStorage } = window
        localStorage.setItem('localCookie', JSON.stringify(info))
    }
    const checkMobile = (mobile: string) => {
        let reg = /^1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/
        if (!mobile?.length) return false
        if (!reg.test(mobile)) return false
        return true

    }
    const toLogin = async (env: string) => {
        if (!env?.length) return
        const mobile = info[env]
        if (!mobile?.length) return
        if (!checkMobile(mobile)) return

        try {
            const url = ''
            const params = {}
            const { result, success, message }: any = await Request(url, params, env)
            console.log(result, success, message)
            if (success) {
                const { token } = result
                setCookies('token', token)
                setCookies('mobile', mobile)
                setCookies('env', env)
            } else setMessage(message)
        } catch (error) { }
    }

    const setCookies = (
        name: string,
        value: string,
        expireSecond: number = EXPIRE
    ) => {
        const param = {
            url: 'http://localhost',
            // domain: 'localhost',
            name: name,
            value: value,
            path: '/',
            expirationDate: EXPIRE,
        }
        if (!!expireSecond) {
            param['expirationDate'] = new Date().getTime() / 1000 + expireSecond
        }
        chrome.cookies.set(param, function (cookie) {
            setLocal()
        })
    }

    const onChange = (
        type: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const val = event?.target?.value
        let obj = { ...info }
        obj[type] = val
        setInfo(obj)
    }
    // 获取token
    const handleSet = (env: string) => {
        if (!env?.length) return
        if (currentURL.indexOf('localhost') > 0) {
            setEnv(env)
            toLogin(env)
        } else setMessage('请在本地开发环境设置')

    }

    const renderInput = useMemo(() => {
        return defaultList.map((i) => (
            <li key={i.value}>
                <label htmlFor={'mobile' + i.label} className="label">
                    <input id={'mobile' + i.label} className="input"
                        onChange={(e) => onChange(i.label, e)}
                        value={info[i.label]}
                        placeholder={`输入${i.value}环境手机号`}
                    />
                </label>
                <a className="btn" onClick={() => handleSet(i.value)}>设置</a>
            </li>
        ))
    }, [defaultList, message, info])

    useEffect(() => {
        _init()
    }, [])

    return (
        <div id="token-extension">
            <header><h1>Setting</h1></header>
            <ul className="container" >
                {renderInput}
                {message?.length ? <li className="msg">{message}</li> : null}
            </ul>
        </div>
    )
}

ReactDOM.render(
    <StrictMode>
        <Popup />
    </StrictMode>,
    document.getElementById('root')
)

