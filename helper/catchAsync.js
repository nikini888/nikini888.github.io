const catchAsync = function (fn) { //chấp nhận 1 function
    return function (req, res, next) { //thi hành function
        fn(req, res, next).catch(e => next(e)); //kiểm tra lỗi
    }
} //gọi 1 fn để tạo 1 fn ảo. Trong quá trình tạo fn ảo nếu có bất kì lỗi gì thì .catch và gọi next()

module.exports = catchAsync;