const CallService = require('./call-service')

// 2.0 endpoints.
const APIV2 = (settings) => {
  if (!settings || !(settings.secret && settings.key)) {
    throw new Error("Context.IO consumer attribues 'secret' and 'key' are both required.")
  }

  const _callService = CallService('2.0', settings)

  return {
    resource(resource_url) {
      if (!resource_url) {
        throw new Error('resource required for explicit resource call')
      }

      return {
        get: _callService.get.bind(_callService, resource_url),
        post: _callService.post.bind(_callService, resource_url),
        delete: _callService.delete.bind(_callService, resource_url),
        put: _callService.put.bind(_callService, resource_url)
      }
    },

    accounts(account_id) {
      let resource = account_id ? 'accounts/' + encodeURIComponent(account_id) + '/' : 'accounts/'

      return {
        get: _callService.get.bind(_callService, resource),
        post: _callService.post.bind(_callService, resource),
        delete: _callService.delete.bind(_callService, resource),

        connect_tokens(token) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += token ? 'connect_tokens/' + encodeURIComponent(token) + '/' : 'connect_tokens/'

          return {
            get: _callService.get.bind(_callService, resource),
            post: _callService.post.bind(_callService, resource),
            delete: _callService.delete.bind(_callService, resource)
          }
        },

        contacts(email) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += email ? 'contacts/' + encodeURIComponent(email) + '/' : 'contacts/'

          return {
            get: _callService.get.bind(_callService, resource),

            files() {
              if (!email) {
                throw new Error('email required for subresources')
              }

              return {
                get: _callService.get.bind(_callService, resource + 'files/')
              }
            },

            messages() {
              if (!email) {
                throw new Error('email required for subresources')
              }

              return {
                get: _callService.get.bind(_callService, resource + 'messages/')
              }
            },

            threads() {
              if (!email) {
                throw new Error('email required for subresources')
              }

              return {
                get: _callService.get.bind(_callService, resource + 'threads/')
              }
            }
          }
        },

        email_addresses(email) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += email ? 'email_addresses/' + encodeURIComponent(email) + '/' : 'email_addresses/'

          return {
            get: _callService.get.bind(_callService, resource),
            post: _callService.post.bind(_callService, resource),
            delete: _callService.delete.bind(_callService, resource)
          }
        },

        files(file_id) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += file_id ? 'files/' + encodeURIComponent(file_id) + '/' : 'files/'

          return {
            get: _callService.get.bind(_callService, resource),

            // Content is a special snowflake with special get functions
            content() {
              if (!file_id) {
                throw new Error('file_id required for subresources')
              }

              resource += 'content/'

              return {
                get(params) {
                  if (params && params.as_link) {
                    return _callService.getRaw(resource, params)
                  } else {
                    return _callService.getFile(resource)
                  }
                }
              }
            },

            related() {
              if (!file_id) {
                throw new Error('file_id required for subresources')
              }

              resource += 'related/'

              return {
                get: _callService.get.bind(_callService, resource)
              }
            }
          }
        },

        messages(message_id) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += message_id ? 'messages/' + encodeURIComponent(message_id) + '/' : 'messages/'

          return {
            get: _callService.get.bind(_callService, resource),
            post: _callService.post.bind(_callService, resource),
            delete: _callService.delete.bind(_callService, resource),

            body() {
              if (!message_id) {
                throw new Error('message_id required for subresources')
              }

              resource += 'body/'

              return {
                get: _callService.get.bind(_callService, resource)
              }
            },

            flags() {
              if (!message_id) {
                throw new Error('message_id required for subresources')
              }

              resource += 'flags/'

              return {
                get: _callService.get.bind(_callService, resource),
                post: _callService.post.bind(_callService, resource)
              }
            },

            folders() {
              if (!message_id) {
                throw new Error('message_id required for subresources')
              }

              resource += 'folders/'

              return {
                get: _callService.get.bind(_callService, resource),
                post: _callService.post.bind(_callService, resource),
                put: _callService.put.bind(_callService, resource)
              }
            },

            headers() {
              if (!message_id) {
                throw new Error('message_id required for subresources')
              }

              resource += 'headers/'

              return {
                get(params) {
                  if (params && params.raw) {
                    return _callService.getRaw(resource, params)
                  } else {
                    return _callService.get(resource)
                  }
                }
              }
            },

            source() {
              if (!message_id) {
                throw new Error('message_id required for subresources')
              }

              resource += 'source/'

              return {
                get: _callService.getRaw.bind(_callService, resource)
              }
            },

            thread() {
              if (!message_id) {
                throw new Error('message_id required for subresources')
              }

              resource += 'thread/'

              return {
                get: _callService.get.bind(_callService, resource)
              }
            }
          }
        },

        sources(label) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += label ? 'sources/' + encodeURIComponent(label) + '/' : 'sources/'

          return {
            get: _callService.get.bind(_callService, resource),
            post: _callService.post.bind(_callService, resource),
            delete: _callService.delete.bind(_callService, resource),

            folders(folder) {
              if (!label) {
                throw new Error('label required for subresources')
              }

              resource += folder ? 'folders/' + encodeURIComponent(folder) + '/' : 'folders/'

              return {
                get: _callService.get.bind(_callService, resource),
                put: _callService.put.bind(_callService, resource),
                delete: _callService.delete.bind(_callService, resource),

                expunge() {
                  if (!folder) {
                    throw new Error('folder required for subresources')
                  }

                  resource += 'expunge/'

                  return {
                    post: _callService.post.bind(_callService, resource)
                  }
                },

                messages(async_job_id) {
                  if (!folder) {
                    throw new Error('folder required for subresources')
                  }

                  resource += async_job_id ? 'messages/' + encodeURIComponent(async_job_id) + '/' : 'messages/'

                  return {
                    get: _callService.get.bind(_callService, resource)
                  }
                }
              }
            }
          }
        },

        sync() {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += 'sync/'

          return {
            get: _callService.get.bind(_callService, resource),
            post: _callService.post.bind(_callService, resource)
          }
        },

        threads(thread_id) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += thread_id ? 'threads/' + encodeURIComponent(thread_id) + '/' : 'threads/'

          return {
            get: _callService.get.bind(_callService, resource),
            delete: _callService.delete.bind(_callService, resource),

            folders() {
              if (!thread_id) {
                throw new Error('thread_id required for subresources')
              }

              resource += 'folders/'

              return {
                post: _callService.post.bind(_callService, resource),
                put: _callService.put.bind(_callService, resource)
              }
            }
          }
        },

        webhooks(webhook_id) {
          if (!account_id) {
            throw new Error('account_id required for subresources')
          }

          resource += webhook_id ? 'webhooks/' + encodeURIComponent(webhook_id) + '/' : 'webhooks/'

          return {
            get: _callService.get.bind(_callService, resource),
            post: _callService.post.bind(_callService, resource),
            delete: _callService.delete.bind(_callService, resource)
          }
        }
      }
    },

    connect_tokens(token) {
      const resource = token ? 'connect_tokens/' + encodeURIComponent(token) + '/' : 'connect_tokens/'

      return {
        get: _callService.get.bind(_callService, resource),
        post: _callService.post.bind(_callService, resource),
        delete: _callService.delete.bind(_callService, resource)
      }
    },

    discovery() {
      return {
        get: _callService.get.bind(_callService, 'discovery/')
      }
    },

    oauth_providers(key) {
      const resource = key ? 'oauth_providers/' + encodeURIComponent(key) + '/' : 'oauth_providers/'

      return {
        get: _callService.get.bind(_callService, resource),
        post: _callService.post.bind(_callService, resource),
        delete: _callService.delete.bind(_callService, resource)
      }
    },

    webhooks(webhook_id) {
      const resource = webhook_id ? 'webhooks/' + encodeURIComponent(webhook_id) + '/' : 'webhooks/'

      return {
        get: _callService.get.bind(_callService, resource),
        post: _callService.post.bind(_callService, resource),
        delete: _callService.delete.bind(_callService, resource)
      }
    }

  }
}

module.exports = APIV2
