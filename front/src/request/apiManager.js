import axios, { CancelTokenSource, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios' // eslint-disable-line
// import { InvalidEntityError } from 'request/errors/invalidEntityError'
import { CancelRequestError } from 'request/errors/cancelRequestError'
// import store from 'redux/store'
import { UnauthorizedError } from './errors/unauthorizedError'

/**
 * @template T, E
 * @abstract
 */
export default class ApiManager {
    /**
     * @param {object} settings 
     * @param {object} settings.type Class to use
     * @param {object} settings.errorType Class to use for error
     * @param {object} settings.key Object name used for base url and retrieve result
     */
    constructor(settings) {
        /** 
         * Base URL used for each API call
         * @protected
         * @type {string} 
         */
        this.baseUrl = `${origin}/api/`
        /** 
         * Type of object to return from API call
         * @protected
         * @type {T & Object} 
         */
        this.type = settings.type
        /** 
         * Type of error object to return from API call when fields are invalid
         * @private
         * @type {E & Object} 
         */
        this.errorType = settings.errorType
        /** 
         * Key to find in API call results
         * @protected
         * @type {string} 
         */
        this.objectName = settings.key?.toLowerCase()
        /** 
         * Key to use in api URL
         * @protected
         * @type {string} 
         */
        this.key = settings.key?.toLowerCase()

        /** 
         * List of cancel tokens that can be canceled
         * @protected
         * @type {Object.<string, CancelTokenSource>}
         */
        this.cancelTokens = {}
    }

    /**
     * Cancel requests pending
     */
    cancel() {
        for (const index in this.cancelTokens) {
            this.cancelTokens[index].cancel('Operation canceled by the user.')
        }
    }

    /**
     * @protected
     * 
     * @typedef {object} ManagerCancelToken
     * @property {CancelTokenSource['token']} token
     * @property {string} cancelId
     * 
     * @returns {ManagerCancelToken}
     */
    _getCancelToken() {
        /** @type {CancelTokenSource} */
        const source = axios.CancelToken.source()

        const cancelId = new Date().getTime().toString()
        this.cancelTokens[cancelId] = source

        return {
            token: source.token,
            cancelId
        }
    }

    /**
     * @protected
     * @param {AxiosError} err 
     */
    _handleError(err) {
        if (axios.isCancel(err)) {
            return new CancelRequestError(err.message)
        } else if (err.response) {
            switch (err.response.status) {
                case 400:
                    return err.response?.data?.errors
                case 401:
                    //TODO add signout logic
                    return new UnauthorizedError("Unauthorized")
                case 403:
                    return err.response?.data?.errors
                case 404:
                    return err.response?.data?.errors
                case 500:
                    return err.response?.data
                default:
                    return err.response?.data?.errors
            }
        } else if (err.request) {
            return err.request?.toString()
        } else {
            return err.message?.toString()
        }
    }

    /**
     * Get a new request
     * @protected
     * @param {object} params
     * @param {(string | number)[]=} params.url
     * @param {AxiosRequestConfig['method']=} params.method
     * @param {AxiosRequestConfig['data']=} params.data
     * @param {AxiosRequestConfig['params']=} params.params
     * @param {AxiosRequestConfig['responseType']=} params.responseType
     * 
     * @typedef {object} ManagerRequest
     * @property {Promise<AxiosResponse>} req
     * @property {string} cancelTokenId
     * 
     * @returns {ManagerRequest}
     */
    _getRequest({ url = [], method = "GET", data = {}, params = {}, responseType = "json" }) {
        const cancelToken = this._getCancelToken()

        return {
            req: axios.request({
                baseURL: this.baseUrl,
                url: `${this.key}${url.length ? `/${url.join('/')}` : ''}`,
                method: method,
                cancelToken: cancelToken.token,
                data,
                params,
                headers: {
                    authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY)}`
                },
                responseType: responseType
            }),
            cancelTokenId: cancelToken.cancelId
        }
    }

    /**
     * Get one by ID
     * @param id 
     * @returns {Promise<T>}
     */
    getById(id = undefined) {
        const request = this._getRequest({ url: [id] })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
      * Get all
      * @param {object=} params
      * @returns {Promise<T[]>}
      */
    getAll(params = {}) {
        const request = this._getRequest({ params })

        return request.req
            .then(res => {
                return res.data[this.objectName].map(x => new (this.type)(x))
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
     * Create
     * @param {T} obj 
     * @returns {Promise<T>}
     */
    create(obj = new (this.type)()) {
        const request = this._getRequest({ method: "POST", data: obj })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
     * Update
     * @param {T} obj 
     * @returns {Promise<T>}
     */
    updateById(obj = new (this.type)(), id = undefined) {
        const request = this._getRequest({ url: [id], method: "PUT", data: obj })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
     * Upsert
     * @param {T} obj 
     * @param {number=} id 
     * @returns {Promise<T>}
     */
    upsert(obj = new (this.type)(), id = undefined) {
        if (id) {
            return this.updateById(obj, id)
        } else {
            return this.create(obj)
        }
    }

    /**
     * Delete
     * @returns {Promise<T>}
     */
    removeById(id = undefined) {
        const request = this._getRequest({ url: [id], method: "DELETE" })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }
}
