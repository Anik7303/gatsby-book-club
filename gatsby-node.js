/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
    try {
        const { createPage } = actions
        const BookComponent = path.resolve(
            "src",
            "components",
            "Book",
            "Book.js"
        )

        const { data, errors } = await graphql(`
            query {
                allBook {
                    nodes {
                        id
                    }
                }
            }
        `)
        if (errors) throw errors
        return data.allBook.nodes.forEach(({ id }) =>
            createPage({
                path: `/book/${id}`,
                component: BookComponent,
                context: { bookId: id },
            })
        )
    } catch (err) {
        console.error(err)
        throw err
    }
}
