import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userApi } from '@/lib/api/users';
import { mockUser, mockUser2, mockPaginatedUsers, mockCreateUserDto } from '@/__tests__/fixtures/users';

// Mock the apiClient module
vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from '@/lib/api/api-client';

const mockedClient = vi.mocked(apiClient);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('userApi', () => {
  // getUsers

  describe('getUsers', () => {
    it('should call GET /api/users with no params when filters are empty', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      const result = await userApi.getUsers();

      expect(mockedClient.get).toHaveBeenCalledWith('/api/users?');
      expect(result).toEqual(mockPaginatedUsers);
    });

    it('should append search param', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      await userApi.getUsers({ search: 'john' });

      const url = mockedClient.get.mock.calls[0][0] as string;
      expect(url).toContain('search=john');
    });

    it('should append city param', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      await userApi.getUsers({ city: 'Santiago' });

      const url = mockedClient.get.mock.calls[0][0] as string;
      expect(url).toContain('city=Santiago');
    });

    it('should append company param', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      await userApi.getUsers({ company: 'Acme' });

      const url = mockedClient.get.mock.calls[0][0] as string;
      expect(url).toContain('company=Acme');
    });

    it('should append pagination params', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      await userApi.getUsers({ page: 2, pageSize: 25 });

      const url = mockedClient.get.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=25');
    });

    it('should combine all filter params', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      await userApi.getUsers({
        search: 'john',
        city: 'Santo Domingo',
        company: 'Acme',
        page: 1,
        pageSize: 10,
      });

      const url = mockedClient.get.mock.calls[0][0] as string;
      expect(url).toContain('search=john');
      expect(url).toContain('city=Santo+Domingo');
      expect(url).toContain('company=Acme');
      expect(url).toContain('page=1');
      expect(url).toContain('pageSize=10');
    });

    it('should not append undefined/empty filter values', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockPaginatedUsers });

      await userApi.getUsers({ search: '', city: undefined });

      const url = mockedClient.get.mock.calls[0][0] as string;
      expect(url).not.toContain('search=');
      expect(url).not.toContain('city=');
    });
  });

  // getUser

  describe('getUser', () => {
    it('should call GET /api/users/:id and return user data', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: mockUser });

      const result = await userApi.getUser(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/api/users/1');
      expect(result).toEqual(mockUser);
    });

    it('should propagate errors', async () => {
      mockedClient.get.mockRejectedValueOnce(new Error('Not Found'));

      await expect(userApi.getUser(999)).rejects.toThrow('Not Found');
    });
  });

  // createUser

  describe('createUser', () => {
    it('should call POST /api/users with user data', async () => {
      const createdUser = { ...mockUser, ...mockCreateUserDto, id: 3 };
      mockedClient.post.mockResolvedValueOnce({ data: createdUser });

      const result = await userApi.createUser(mockCreateUserDto);

      expect(mockedClient.post).toHaveBeenCalledWith('/api/users', mockCreateUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should propagate errors', async () => {
      mockedClient.post.mockRejectedValueOnce(new Error('Validation Error'));

      await expect(userApi.createUser(mockCreateUserDto)).rejects.toThrow('Validation Error');
    });
  });

  // updateUser

  describe('updateUser', () => {
    it('should call PUT /api/users/:id with user data', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      mockedClient.put.mockResolvedValueOnce({ data: updatedUser });

      const result = await userApi.updateUser(1, mockCreateUserDto);

      expect(mockedClient.put).toHaveBeenCalledWith('/api/users/1', mockCreateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should propagate errors', async () => {
      mockedClient.put.mockRejectedValueOnce(new Error('Server Error'));

      await expect(userApi.updateUser(1, mockCreateUserDto)).rejects.toThrow('Server Error');
    });
  });

  // deleteUser

  describe('deleteUser', () => {
    it('should call DELETE /api/users/:id', async () => {
      mockedClient.delete.mockResolvedValueOnce({});

      await userApi.deleteUser(1);

      expect(mockedClient.delete).toHaveBeenCalledWith('/api/users/1');
    });

    it('should propagate errors', async () => {
      mockedClient.delete.mockRejectedValueOnce(new Error('Forbidden'));

      await expect(userApi.deleteUser(1)).rejects.toThrow('Forbidden');
    });
  });
});
