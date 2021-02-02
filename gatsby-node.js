/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const path = require("path")

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions
    const BookComponent = path.resolve("src", "components", "Book", "Book.js")

    return graphql(`
        query {
            allBook {
                nodes {
                    id
                }
            }
        }
    `).then(result => {
        const { data, errors } = result
        if (errors) throw errors
        data.allBook.nodes.forEach(({ id }) => {
            createPage({
                path: `/book/${id}`,
                component: BookComponent,
                context: { bookId: id },
            })
        })
    })
}
