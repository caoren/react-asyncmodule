import { getCompsByMatch } from '../src/index';

const createPromise = (str) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(str);
    });
});
describe('getCompsByMatch', () => {
    let routes;
    beforeEach(() => {
        routes = [
            {
                route: {
                    path: '/list',
                    exact: true,
                    component: {
                        preload: () => createPromise(1)
                    }
                },
                match: {
                    path: '/list',
                    url: '/list',
                    isExact: true,
                    params: {}
                }
            },
            {
                route: {
                    path: '/list/a',
                    exact: true
                },
                match: {
                    path: '/list/a',
                    url: '/list/a',
                    isExact: true,
                    params: {}
                }
            },
            {
                route: {
                    path: '/list/b',
                    exact: true,
                    component: {
                        preload: () => createPromise({
                            __esModule: true,
                            default: {}
                        })
                    }
                },
                match: {
                    path: '/list/b',
                    url: '/list/b',
                    isExact: true,
                    params: {}
                }
            }
        ];
    });
    afterEach(() => {
        routes = undefined;
    })
    test('default', () => {
        const res = getCompsByMatch();
        expect(res).toBeInstanceOf(Promise);
    });
    test('custom', () => {
        expect(getCompsByMatch(routes)).toBeInstanceOf(Promise);
    });
    test('res', () => {
        expect.assertions(1);
        return getCompsByMatch(routes).then((promises) => {
            expect(promises).toEqual([1, {}]); 
        });
    })
});