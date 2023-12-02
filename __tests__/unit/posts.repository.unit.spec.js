// __tests__/unit/posts.repository.unit.spec.js

import { jest } from '@jest/globals';
import { PostsRepository } from '../../src/repositories/posts.repository.js';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
    posts: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

let postsRepository = new PostsRepository(mockPrisma);

describe('Posts Repository Unit Test', () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test('findAllPosts Method', async () => {
        const mockReturn = 'findMany String';
        mockPrisma.posts.findMany.mockReturnValue(mockReturn);

        const posts = await postsRepository.findAllPosts();

        // findMany 함수의 반환값은 findAllPosts의 반환값과 같다.
        expect(posts).toBe(mockReturn);

        // findMany 함수는 최종적으로 1번만 호출된다.
        expect(postsRepository.prisma.posts.findMany).toHaveBeenCalledTimes(1);
    });

    test('createPost Method', async () => {
        // create Mock의 Return 값을 "create Return String"으로 설정한다
        const mockReturn = 'create Post Return String';
        mockPrisma.posts.create.mockReturnValue(mockReturn);
        // createPost Method를 실행하기 위해 필요한 params
        const createPostParams = {
            nickname: 'createPostNickname',
            password: 'createPostPassword',
            title: 'createPostTitle',
            content: 'createPostContent',
        };
        // postsRepository의 createPost Method를 실행한다.
        const createPostData = await postsRepository.createPost(
            createPostParams.nickname,
            createPostParams.password,
            createPostParams.title,
            createPostParams.content
        );
        // createPostData는 prisma.posts의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
        expect(createPostData).toEqual(mockReturn);

        // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 1번 실행합니다.
        expect(mockPrisma.posts.create).toHaveBeenCalledTimes(1);

        // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 아래와 같은 값으로 호출합니다.
        expect(mockPrisma.posts.create).toHaveBeenCalledWith({
            data: {
                nickname: createPostParams.nickname,
                password: createPostParams.password,
                title: createPostParams.title,
                content: createPostParams.content,
            },
        });
    });
});
