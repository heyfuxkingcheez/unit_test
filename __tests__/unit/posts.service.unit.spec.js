// __tests__/unit/posts.service.unit.spec.js

import { jest } from '@jest/globals';
import { PostsService } from '../../src/services/posts.service.js';

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockPostsRepository = {
    findAllPosts: jest.fn(),
    findPostById: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let postsService = new PostsService(mockPostsRepository);

describe('Posts Service Unit Test', () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test('findAllPosts Method', async () => {
        const samplePosts = [
            {
                postId: 2,
                nickname: '욱기정',
                title: '제목 입니다',
                createdAt: '2023-12-02T11:37:57.261Z',
                updatedAt: '2023-12-02T11:37:57.261Z',
            },
            {
                postId: 3,
                nickname: '욱기정',
                title: '제목 입니다',
                createdAt: '2023-12-03T11:37:57.261Z',
                updatedAt: '2023-12-03T11:37:57.261Z',
            },
        ];

        mockPostsRepository.findAllPosts.mockReturnValue(samplePosts);

        const allPosts = await postsService.findAllPosts();

        expect(allPosts).toEqual(
            samplePosts.sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        );

        expect(mockPostsRepository.findAllPosts).toHaveBeenCalledTimes(1);
    });

    test('deletePost Method By Success', async () => {
        const samplePost = {
            postId: 2,
            nickname: '욱기정',
            password: '1234',
            title: '제목 입니다',
            content: '테스트 코드용 내용입니다',
            createdAt: '2023-12-02T11:37:57.261Z',
            updatedAt: '2023-12-02T11:37:57.261Z',
        };

        mockPostsRepository.findPostById.mockReturnValue(samplePost);

        const deletedPost = await postsService.deletePost(2, '1234');

        expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
            samplePost.postId
        );

        expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
            samplePost.postId,
            samplePost.password
        );

        expect(deletedPost).toEqual({
            postId: samplePost.postId,
            nickname: samplePost.nickname,
            title: samplePost.title,
            content: samplePost.content,
            createdAt: samplePost.createdAt,
            updatedAt: samplePost.updatedAt,
        });
    });

    test('deletePost Method By Not Found Post Error', async () => {
        const samplePost = null;
        mockPostsRepository.findPostById.mockReturnValue(samplePost);

        try {
            await postsService.deletePost(123123123, 'asdasdasd');
        } catch (err) {
            expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
            expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
                123123123
            );

            expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(0);
            // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("존재하지 않는 게시글입니다.");
            expect(err.message).toEqual('존재하지 않는 게시글입니다.');
        }
    });
});
