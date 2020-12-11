import { Release, ErrorRelease } from 'request/objects/release'
import ApiManager from 'request/apiManager'

/**
 * ReleaseManager
 * @extends {ApiManager<Release, ErrorRelease>}
 */
export default class ReleaseManager extends ApiManager {
    constructor() {
        super({ type: Release, errorType: ErrorRelease, key: 'release' })
    }

    /**
     * @override
     */
    create(obj = new Release()) {
        obj.id = obj.id + 999
        return super.create(obj)
    }
}