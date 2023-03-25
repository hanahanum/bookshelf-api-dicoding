const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload

  // Jika client tidak mengisi nama buku
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  };

  // Jika client memasukkan nilai readpage lebih besar daripada pagecount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = (pageCount === readPage)
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const successed = books.filter((book) => book.id === id).length > 0

  // jika value buku sudah sesuai
  if (successed) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  // jika value buku tidak sesuai
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let filteredbook = books

  // mendapatkan filter buku berdasarkan namanya
  if (name !== undefined) {
    filteredbook = filteredbook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  // mendapatkan filter buku berdasarkan dari baca atau tidaknya
  if (reading !== undefined) {
    filteredbook = filteredbook.filter((book) => book.reading === !!Number(reading))
  }

  // mendapatkan filter buku berdasarkan dari selesai atau tidaknya
  if (finished !== undefined) {
    filteredbook = filteredbook.filter((book) => book.finished === !!Number(finished))
  }

  // menampilkan semua buku
  const response = h.response({
    status: 'success',
    data: {
      books: filteredbook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((b) => b.id === id)[0]

  // menampilkan buku dengan id yang sesuai
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  // buku dengan id yang tidak sesuai
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === id)

  const finished = (pageCount === readPage)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }

    // jika client tidak mengisi nama dari buku
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    // jika client memberikan value readpage lebih besar dari pagecount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    // buku berhasil diedit
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  // jika id buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((book) => book.id === id)

  // buku berhasil dihapus
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  // jika id buku tidak sesuai
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
