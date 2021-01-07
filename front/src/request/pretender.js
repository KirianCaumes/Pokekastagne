import Pretender from 'pretender'

/**
 * ⚠ DEV ONLY
 */
new Pretender(function () {
    this.post('/api/user/login', request => {
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ user: { token: 'abc' } })]
    }, 500)
    this.post('/api/user', request => {
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ user: { token: 'abc' } })]
    }, 500)
    this.get('/api/user/me', request => {
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ user: { email: 'test@mail.com', username: 'Demo', password: 'abc', skin: 1 } })]
    }, 500)

    this.get('/api/param', async request => {
        await new Promise(resolve => setTimeout(resolve, 500))
        return [200, { "Content-Type": "application/json" }, JSON.stringify({
            param: {
                "abc": [
                    { key: 1, text: "abc" }
                ],
                "def": [
                    { key: 1, text: "abc" }
                ],
                "aze": [
                    { key: 2, text: "abc" }
                ]
            },
            success: true
        })]
    })

    this.get('/api/release', async request => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const els = []
        for (let i = 0; i < 555; i++) els.push({ id: i, title: 'toto' + i, year: 1234, desc: 'waw' })
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ release: els })]
    })
    this.get('/api/release/:id', async request => {
        await new Promise(resolve => setTimeout(resolve, 500))
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ release: { id: request.params.id, title: 'toto', year: 1234, desc: 'waw', categories: [2, 3] } })]
    })
    // this.get('/api/release/:id', async request => {
    //     await new Promise(resolve => setTimeout(resolve, 500))
    //     return [404, { "Content-Type": "application/json" }, JSON.stringify({
    //         "success": false,
    //         "statusCode": 404,
    //         "errors": [
    //             {
    //                 "code": "not_found",
    //                 "description": "Non trouvé",
    //             }
    //         ]
    //     })]
    // })
    this.post('/api/release', async request => {
        await new Promise(resolve => setTimeout(resolve, 500))
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ release: { id: 66, title: '123', year: 1234, desc: 'waw' } })]
    })
    // this.put('/api/release/:id', async request => {
    //     await new Promise(resolve => setTimeout(resolve, 500))
    //     return [200, { "Content-Type": "application/json" }, JSON.stringify({ release: { id: request.params.id, title: 'toto', year: 1234, desc: 'waw' } })]
    // })
    this.put('/api/release/:id', async request => {
        await new Promise(resolve => setTimeout(resolve, 500))
        return [400, { "Content-Type": "application/json" }, JSON.stringify({
            "success": false,
            "statusCode": 400,
            "errors": [
                {
                    "code": "data_not_well_formated",
                    "description": "Certains champs sont invalides",
                    "validationResults": [
                        {
                            "memberNames": [
                                "title",
                                "year"
                            ],
                            "errorMessage": "Ce couple Entité et Origine n'existe pas"
                        }
                    ]
                }
            ]
        })]
    })
    this.delete('/api/release/:id', async request => {
        await new Promise(resolve => setTimeout(resolve, 500))
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ release: {} })]
    })
})