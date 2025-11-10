<template>
  <div class="blog-platform">
    <!-- 头部导航 -->
    <header class="blog-header">
      <div class="header-content">
        <h1 class="logo">Dark Chronicles</h1>
        <div class="header-actions">
          <template v-if="!currentUser">
            <button @click="showLoginModal = true" class="btn-primary">Sign In</button>
            <button @click="showRegisterModal = true" class="btn-secondary">Register</button>
          </template>
          <template v-else>
            <span class="user-info">Welcome, {{ currentUser.username }}</span>
            <button v-if="currentUser.role === 'author' || currentUser.role === 'admin'"
                    @click="showNewPostModal = true"
                    class="btn-primary">Write Chronicle</button>
            <button @click="logout" class="btn-secondary">Logout</button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <h3>Categories</h3>
          <ul class="category-list">
            <li @click="selectedCategory = ''" :class="{ active: selectedCategory === '' }">
              All
            </li>
            <li v-for="cat in categories"
                :key="cat"
                @click="selectedCategory = cat"
                :class="{ active: selectedCategory === cat }">
              {{ cat }}
            </li>
          </ul>
        </div>
      </aside>

      <!-- 文章列表/详情区域 -->
      <main class="content-area">
        <!-- 文章列表视图 -->
        <div v-if="currentView === 'list'" class="posts-list">
          <div v-if="loading" class="loading">Loading chronicles...</div>
          <div v-else-if="posts.length === 0" class="empty-state">
            No chronicles found
          </div>
          <article v-else v-for="post in posts" :key="post._id" class="post-card">
            <div v-if="post.coverImage" class="post-cover">
              <img :src="post.coverImage" :alt="post.title" />
            </div>
            <div class="post-content">
              <h2 class="post-title" @click="viewPost(post._id)">{{ post.title }}</h2>
              <div class="post-meta">
                <span class="author">
                  <i>👤</i> {{ post.author.username }}
                </span>
                <span class="date">
                  <i>📅</i> {{ formatDate(post.createdAt) }}
                </span>
                <span class="category">
                  <i>📁</i> {{ post.category }}
                </span>
                <span class="views">
                  <i>👁</i> {{ post.views }}
                </span>
                <span class="likes">
                  <i>❤️</i> {{ post.likes?.length || 0 }}
                </span>
              </div>
              <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </article>

          <!-- 分页 -->
          <div v-if="pagination.pages > 1" class="pagination">
            <button @click="goToPage(pagination.page - 1)"
                    :disabled="pagination.page === 1"
                    class="btn-secondary">Previous</button>
            <span class="page-info">Page {{ pagination.page }} / {{ pagination.pages }}</span>
            <button @click="goToPage(pagination.page + 1)"
                    :disabled="pagination.page === pagination.pages"
                    class="btn-secondary">Next</button>
          </div>
        </div>

        <!-- 文章详情视图 -->
        <div v-else-if="currentView === 'detail' && currentPost" class="post-detail">
          <button @click="backToList" class="btn-back">← Back to List</button>

          <article class="post-full">
            <h1 class="post-title">{{ currentPost.title }}</h1>
            <div class="post-meta">
              <span class="author">👤 {{ currentPost.author.username }}</span>
              <span class="date">📅 {{ formatDate(currentPost.createdAt) }}</span>
              <span class="category">📁 {{ currentPost.category }}</span>
              <span class="views">👁 {{ currentPost.views }}</span>
            </div>

            <div v-if="currentPost.coverImage" class="post-cover-full">
              <img :src="currentPost.coverImage" :alt="currentPost.title" />
            </div>

            <div class="post-body" v-html="formatContent(currentPost.content)"></div>

            <div class="post-tags">
              <span v-for="tag in currentPost.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="post-actions">
              <button @click="toggleLike"
                      :class="['btn-like', { liked: isLiked }]"
                      :disabled="!currentUser">
                ❤️ {{ currentPost.likes?.length || 0 }}
              </button>
              <button v-if="canEditPost"
                      @click="editPost"
                      class="btn-secondary">Edit</button>
              <button v-if="canEditPost"
                      @click="deletePost"
                      class="btn-danger">Delete</button>
            </div>
          </article>

          <!-- 评论区 -->
          <div class="comments-section">
            <h3>Comments ({{ comments.length }})</h3>

            <!-- 发表评论 -->
            <div v-if="currentUser" class="comment-form">
              <textarea v-model="newComment"
                        placeholder="Write your thoughts into the void..."
                        rows="3"></textarea>
              <button @click="submitComment"
                      :disabled="!newComment.trim()"
                      class="btn-primary">Post Comment</button>
            </div>
            <div v-else class="login-prompt">
              Please <a @click="showLoginModal = true">sign in</a> to comment
            </div>

            <!-- 评论列表 -->
            <div class="comments-list">
              <div v-for="comment in comments" :key="comment._id" class="comment">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author.username }}</span>
                  <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
                <div v-if="canDeleteComment(comment)" class="comment-actions">
                  <button @click="deleteComment(comment._id)" class="btn-link">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 登录模态框 -->
    <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
      <div class="modal">
        <h2>Sign In</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label>Username</label>
            <input v-model="loginForm.username" type="text" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="loginForm.password" type="password" required />
          </div>
          <div v-if="loginError" class="error-message">{{ loginError }}</div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Sign In</button>
            <button type="button" @click="showLoginModal = false" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showRegisterModal" class="modal-overlay" @click.self="showRegisterModal = false">
      <div class="modal">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <label>Username</label>
            <input v-model="registerForm.username" type="text" required minlength="3" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="registerForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="registerForm.password" type="password" required minlength="6" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="registerForm.role">
              <option value="user">Reader</option>
              <option value="author">Author</option>
            </select>
          </div>
          <div v-if="registerError" class="error-message">{{ registerError }}</div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Register</button>
            <button type="button" @click="showRegisterModal = false" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 新建/编辑文章模态框 -->
    <div v-if="showNewPostModal" class="modal-overlay" @click.self="closePostModal">
      <div class="modal modal-large">
        <h2>{{ editingPostId ? 'Edit Chronicle' : 'Write New Chronicle' }}</h2>
        <form @submit.prevent="savePost">
          <div class="form-group">
            <label>Title</label>
            <input v-model="postForm.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Category</label>
            <input v-model="postForm.category" type="text" placeholder="Technology, Life, Thoughts, etc." />
          </div>
          <div class="form-group">
            <label>Tags (comma separated)</label>
            <input v-model="postForm.tagsInput" type="text" placeholder="JavaScript, Vue, Frontend" />
          </div>
          <div class="form-group">
            <label>Cover Image URL</label>
            <input v-model="postForm.coverImage" type="url" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label>Content</label>
            <textarea v-model="postForm.content" rows="15" required></textarea>
          </div>
          <div class="form-group">
            <label>
              <input v-model="postForm.isDraft" type="checkbox" />
              Save as Draft
            </label>
          </div>
          <div v-if="postError" class="error-message">{{ postError }}</div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ editingPostId ? 'Save Changes' : 'Publish Chronicle' }}
            </button>
            <button type="button" @click="closePostModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BlogPlatform',
  data() {
    return {
      // 用户相关
      currentUser: null,
      token: null,

      // 视图状态
      currentView: 'list', // 'list' 或 'detail'
      loading: false,

      // 文章列表
      posts: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      },
      selectedCategory: '',

      // 文章详情
      currentPost: null,
      comments: [],
      newComment: '',

      // 分类
      categories: ['Technology', 'Life', 'Thoughts', 'Tutorials', 'Resources'],

      // 模态框控制
      showLoginModal: false,
      showRegisterModal: false,
      showNewPostModal: false,

      // 表单数据
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        role: 'author'
      },
      postForm: {
        title: '',
        content: '',
        category: '',
        tagsInput: '',
        coverImage: '',
        isDraft: false
      },
      editingPostId: null,

      // 错误信息
      loginError: '',
      registerError: '',
      postError: ''
    };
  },
  computed: {
    isLiked() {
      if (!this.currentUser || !this.currentPost) return false;
      return this.currentPost.likes?.includes(this.currentUser._id);
    },
    canEditPost() {
      if (!this.currentUser || !this.currentPost) return false;
      return this.currentPost.author._id === this.currentUser._id ||
             this.currentUser.role === 'admin';
    }
  },
  mounted() {
    // 从 localStorage 恢复登录状态
    const token = localStorage.getItem('blog_token');
    const user = localStorage.getItem('blog_user');
    if (token && user) {
      this.token = token;
      this.currentUser = JSON.parse(user);
    }

    this.fetchPosts();
  },
  methods: {
    // ========== 认证相关 ==========

    async login() {
      try {
        this.loginError = '';
        const response = await axios.post('/api/auth/login', this.loginForm);

        this.token = response.data.token;
        this.currentUser = response.data.user;

        localStorage.setItem('blog_token', this.token);
        localStorage.setItem('blog_user', JSON.stringify(this.currentUser));

        this.showLoginModal = false;
        this.loginForm = { username: '', password: '' };
      } catch (error) {
        this.loginError = error.response?.data?.error || 'Sign in failed';
      }
    },

    async register() {
      try {
        this.registerError = '';
        const response = await axios.post('/api/auth/register', this.registerForm);

        this.token = response.data.token;
        this.currentUser = response.data.user;

        localStorage.setItem('blog_token', this.token);
        localStorage.setItem('blog_user', JSON.stringify(this.currentUser));

        this.showRegisterModal = false;
        this.registerForm = { username: '', email: '', password: '', role: 'author' };
      } catch (error) {
        this.registerError = error.response?.data?.error || 'Registration failed';
      }
    },

    logout() {
      this.token = null;
      this.currentUser = null;
      localStorage.removeItem('blog_token');
      localStorage.removeItem('blog_user');
      this.backToList();
    },

    getAuthHeaders() {
      return {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      };
    },

    // ========== 文章列表相关 ==========

    async fetchPosts() {
      try {
        this.loading = true;
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        };

        if (this.selectedCategory) {
          params.category = this.selectedCategory;
        }

        const response = await axios.get('/api/posts', { params });
        this.posts = response.data.posts;
        this.pagination = response.data.pagination;
      } catch (error) {
        console.error('Failed to fetch chronicles:', error);
      } finally {
        this.loading = false;
      }
    },

    goToPage(page) {
      this.pagination.page = page;
      this.fetchPosts();
    },

    // ========== 文章详情相关 ==========

    async viewPost(postId) {
      try {
        this.loading = true;
        const response = await axios.get(`/api/posts/${postId}`);
        this.currentPost = response.data.post;
        this.currentView = 'detail';

        // 加载评论
        await this.fetchComments(postId);
      } catch (error) {
        console.error('Failed to fetch chronicle details:', error);
      } finally {
        this.loading = false;
      }
    },

    backToList() {
      this.currentView = 'list';
      this.currentPost = null;
      this.comments = [];
      this.fetchPosts();
    },

    async toggleLike() {
      if (!this.currentUser) return;

      try {
        const response = await axios.post(
          `/api/posts/${this.currentPost._id}/like`,
          {},
          this.getAuthHeaders()
        );

        // 更新点赞状态
        await this.viewPost(this.currentPost._id);
      } catch (error) {
        console.error('Failed to like:', error);
      }
    },

    editPost() {
      this.editingPostId = this.currentPost._id;
      this.postForm = {
        title: this.currentPost.title,
        content: this.currentPost.content,
        category: this.currentPost.category,
        tagsInput: this.currentPost.tags.join(', '),
        coverImage: this.currentPost.coverImage || '',
        isDraft: this.currentPost.status === 'draft'
      };
      this.showNewPostModal = true;
    },

    async deletePost() {
      if (!confirm('Are you sure you want to delete this chronicle?')) return;

      try {
        await axios.delete(
          `/api/posts/${this.currentPost._id}`,
          this.getAuthHeaders()
        );

        alert('Chronicle deleted');
        this.backToList();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete');
      }
    },

    // ========== 文章编辑相关 ==========

    async savePost() {
      try {
        this.postError = '';

        const postData = {
          title: this.postForm.title,
          content: this.postForm.content,
          category: this.postForm.category || '未分类',
          tags: this.postForm.tagsInput.split(',').map(t => t.trim()).filter(t => t),
          coverImage: this.postForm.coverImage,
          status: this.postForm.isDraft ? 'draft' : 'published'
        };

        if (this.editingPostId) {
          // 更新文章
          await axios.put(
            `/api/posts/${this.editingPostId}`,
            postData,
            this.getAuthHeaders()
          );
          alert('Chronicle updated');
          await this.viewPost(this.editingPostId);
        } else {
          // 创建文章
          const response = await axios.post(
            '/api/posts',
            postData,
            this.getAuthHeaders()
          );
          alert('Chronicle published');
          await this.viewPost(response.data.post._id);
        }

        this.closePostModal();
      } catch (error) {
        this.postError = error.response?.data?.error || 'Failed to save';
      }
    },

    closePostModal() {
      this.showNewPostModal = false;
      this.editingPostId = null;
      this.postForm = {
        title: '',
        content: '',
        category: '',
        tagsInput: '',
        coverImage: '',
        isDraft: false
      };
      this.postError = '';
    },

    // ========== 评论相关 ==========

    async fetchComments(postId) {
      try {
        const response = await axios.get(`/api/comments/post/${postId}`);
        this.comments = response.data.comments;
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    },

    async submitComment() {
      if (!this.newComment.trim()) return;

      try {
        await axios.post(
          '/api/comments',
          {
            content: this.newComment,
            postId: this.currentPost._id
          },
          this.getAuthHeaders()
        );

        this.newComment = '';
        await this.fetchComments(this.currentPost._id);
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to post comment');
      }
    },

    canDeleteComment(comment) {
      if (!this.currentUser) return false;
      return comment.author._id === this.currentUser._id ||
             this.currentUser.role === 'admin';
    },

    async deleteComment(commentId) {
      if (!confirm('Are you sure you want to delete this comment?')) return;

      try {
        await axios.delete(
          `/api/comments/${commentId}`,
          this.getAuthHeaders()
        );

        await this.fetchComments(this.currentPost._id);
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete comment');
      }
    },

    // ========== 工具方法 ==========

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    getExcerpt(content) {
      const text = content.replace(/<[^>]*>/g, '');
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    },

    formatContent(content) {
      // 简单的内容格式化，将换行转换为 <br>
      return content.replace(/\n/g, '<br>');
    }
  },
  watch: {
    selectedCategory() {
      this.pagination.page = 1;
      this.fetchPosts();
    }
  }
};
</script>

<style scoped>
.blog-platform {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 头部样式 */
.blog-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-info {
  color: #333;
  font-weight: 500;
}

/* 主内容区域 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

/* 侧边栏 */
.sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  color: #555;
}

.category-list li:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.category-list li.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

/* 内容区域 */
.content-area {
  min-height: 600px;
}

/* 文章卡片 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.post-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.post-title:hover {
  color: #667eea;
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  color: #777;
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-excerpt {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* 文章详情 */
.post-detail {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
}

.btn-back {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #e0e0e0;
}

.post-full .post-title {
  font-size: 2rem;
  margin: 1rem 0;
}

.post-cover-full {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  margin: 1.5rem 0;
}

.post-cover-full img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-body {
  line-height: 1.8;
  color: #333;
  margin: 2rem 0;
  font-size: 1.05rem;
}

.post-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem 0;
  border-top: 2px solid #f0f0f0;
}

.btn-like {
  background: #fff;
  border: 2px solid #ff4757;
  color: #ff4757;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-like:hover:not(:disabled) {
  background: #ff4757;
  color: white;
}

.btn-like.liked {
  background: #ff4757;
  color: white;
}

.btn-like:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 评论区 */
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.comments-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.comment-form textarea:focus {
  outline: none;
  border-color: #667eea;
}

.login-prompt {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.login-prompt a {
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.comment-author {
  font-weight: bold;
  color: #667eea;
}

.comment-date {
  color: #999;
}

.comment-content {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.comment-actions {
  margin-top: 0.5rem;
}

.btn-link {
  background: none;
  border: none;
  color: #ff4757;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-secondary:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-danger:hover {
  background: #ff3838;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
}

.page-info {
  color: #333;
  font-weight: 500;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 800px;
}

.modal h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.error-message {
  color: #ff4757;
  background: #ffe0e3;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* 加载和空状态 */
.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: white;
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
