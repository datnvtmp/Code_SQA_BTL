import { images } from "@/constants";

export const postsData = [
    {
        id: '1',
        user: {
            name: 'Otaku Lê',
            timeAgo: '5 giờ'
        },
        content: {
            title: 'Gà nướng tiêu đen',
            description: 'Món tao chế trong lúc đi nvqs, Lorum lmao ipsum, florentino alpapad',
            hashtags: ['Gà nướng', 'Tiêu Đen', 'NCKD'],
            likes: 16,
            comments: 34,
            image: images.sampleFood1
        },
        comments: [
            { user: 'Nobita', text: 'Vippro quá mày' },
            { user: 'Nobita', text: 'Mày cho tao đớp với để tao đỡ phải nấu chi cho mệt' }
        ]
    },
    {
        id: '2',
        user: {
            name: 'Nobita',
            timeAgo: '1 ngày'
        },
        content: {
            title: 'Sốt sò điệp với tôm',
            description: 'Món này mình ăn được một lần ở Quảng Ninh ngon quá nên tán a đầu bếp để có công thức cho mọi người này',
            hashtags: ['Sò điệp', 'Tôm', 'Bánh mì gạo lứt', 'Hải sản'],
            likes: 16,
            comments: 34,
            image: images.sampleFood2
        },
        comments: [
            { user: 'Otaku Lê', text: 'Chịu đựng được không mày?' },
            { user: 'Bruh Lmao', text: 'Chịu đựng được không mày?' }
        ]
    },
    {
        id: '3',
        user: {
            name: 'Wibu Chúa',
            timeAgo: '2 ngày'
        },
        content: {
            title: 'Salad trứng gà',
            description: 'Ai muốn làm rau sạch trên đĩa của tao tối nay nào',
            hashtags: ['Món chay', 'Trứng', 'Bơ'],
            likes: 134,
            comments: 233,
            image: images.sampleFood3
        },
        comments: [
            { user: 'Mun Ngáo', text: 'Trứng dở vcl đéo thèm ăn, công thức như ' },
            { user: 'Nobita', text: 'Nói tiếng người đi má' }
        ]
    },
    {
        id: '4',
        user: {
            name: 'Mun Ngáo',
            timeAgo: '3 ngày'
        },
        content: {
            title: 'Salad cá nướng',
            description: 'Ai muốn làm rau sạch trên đĩa của tao tối nay nào',
            hashtags: ['Món chay', 'Trứng', 'Bơ'],
            likes: 134,
            comments: 233,
            image: images.sampleFood1
        },
        comments: [
            { user: 'Otaku Lê', text: 'Ngon nha shop' },
            { user: 'Bruh Lmao', text: 'Ngon quá ạ, công thức như thế nào vậy shop?' }
        ]
    },
    {
        id: '5',
        user: {
            name: 'Bruh Lmao',
            timeAgo: '4 ngày'
        },
        content: {
            title: 'Phở bò tái chín',
            description: 'Sáng nay làm phở cho cả nhà, nước dùng ngọt thanh đúng chuẩn Hà Nội',
            hashtags: ['Phở', 'Thịt bò', 'Bánh phở', 'Món Việt'],
            likes: 89,
            comments: 45,
            image: images.sampleFood2
        },
        comments: [
            { user: 'Wibu Chúa', text: 'Nhìn ngon quá, cho xin công thức đi' },
            { user: 'Nobita', text: 'Nước dùng làm sao mà trong thế?' }
        ]
    },
    {
        id: '6',
        user: {
            name: 'Dũng Lại Lập Trình',
            timeAgo: '5 ngày'
        },
        content: {
            title: 'Bánh mì thịt nướng',
            description: 'Bánh mì giòn rụm với thịt nướng thơm lừng, pate béo ngậy',
            hashtags: ['Bánh mì', 'Thịt nướng', 'Pate', 'Đồ ăn nhanh'],
            likes: 156,
            comments: 78,
            image: images.sampleFood3
        },
        comments: [
            { user: 'Otaku Lê', text: 'Bánh mì ở đâu vậy bạn?' },
            { user: 'Mun Ngáo', text: 'Nhìn đã quá, đói bụng rồi' }
        ]
    },
    {
        id: '7',
        user: {
            name: 'Chó Kem',
            timeAgo: '1 tuần'
        },
        content: {
            title: 'Bún chả Hà Nội',
            description: 'Làm bún chả theo công thức của bà ngoại, thịt nướng thơm phức',
            hashtags: ['Bún chả', 'Thịt nướng', 'Món Việt', 'Hà Nội'],
            likes: 203,
            comments: 112,
            image: images.featuredFood1
        },
        comments: [
            { user: 'Wibu Chúa', text: 'Nhớ quê quá, lâu rồi không ăn bún chả' },
            { user: 'Nobita', text: 'Nước chấm làm sao vậy bạn?' }
        ]
    },
    {
        id: '8',
        user: {
            name: 'Lilikama',
            timeAgo: '1 tuần'
        },
        content: {
            title: 'Cơm tấm sườn bì chả',
            description: 'Bữa trưa đầy đủ với cơm tấm, sườn nướng, bì và chả trứng',
            hashtags: ['Cơm tấm', 'Sườn nướng', 'Bì', 'Món miền Nam'],
            likes: 178,
            comments: 95,
            image: images.featuredFood2
        },
        comments: [
            { user: 'Otaku Lê', text: 'Cơm tấm này ở đâu vậy?' },
            { user: 'Bruh Lmao', text: 'Nhìn ngon quá, giá bao nhiêu vậy?' }
        ]
    },
    {
        id: '9',
        user: {
            name: 'Wibu Chúa',
            timeAgo: '2 tuần'
        },
        content: {
            title: 'Bánh xèo miền Tây',
            description: 'Bánh xèo giòn tan với tôm thịt đầy đủ, ăn kèm rau sống',
            hashtags: ['Bánh xèo', 'Tôm', 'Thịt', 'Miền Tây'],
            likes: 267,
            comments: 145,
            image: images.featuredFood3
        },
        comments: [
            { user: 'Mun Ngáo', text: 'Bánh xèo này làm sao giòn thế?' },
            { user: 'Dũng Lại Lập Trình', text: 'Cho xin công thức đi bạn' }
        ]
    },
    {
        id: '10',
        user: {
            name: 'Nobita',
            timeAgo: '2 tuần'
        },
        content: {
            title: 'Nem nướng Nha Trang',
            description: 'Nem nướng thơm lừng với bánh tráng và rau sống, đúng vị Nha Trang',
            hashtags: ['Nem nướng', 'Nha Trang', 'Bánh tráng', 'Đồ nướng'],
            likes: 189,
            comments: 102,
            image: images.featuredFood4
        },
        comments: [
            { user: 'Chó Kem', text: 'Nhớ Nha Trang quá, nem nướng ở đây ngon nhất' },
            { user: 'Lilikama', text: 'Nhìn đã quá, đói bụng rồi' }
        ]
    },
    {
        id: '11',
        user: {
            name: 'Otaku Lê',
            timeAgo: '3 tuần'
        },
        content: {
            title: 'Bánh cuốn nóng',
            description: 'Bánh cuốn mềm mịn với nhân thịt băm, ăn kèm chả lụa và nước mắm',
            hashtags: ['Bánh cuốn', 'Thịt băm', 'Chả lụa', 'Món sáng'],
            likes: 145,
            comments: 67,
            image: images.featuredFood5
        },
        comments: [
            { user: 'Wibu Chúa', text: 'Bánh cuốn này ở đâu vậy bạn?' },
            { user: 'Bruh Lmao', text: 'Nhìn ngon quá, sáng mai đi ăn thử' }
        ]
    },
    {
        id: '12',
        user: {
            name: 'Mun Ngáo',
            timeAgo: '3 tuần'
        },
        content: {
            title: 'Chả cá Lã Vọng',
            description: 'Chả cá thơm lừng với nghệ và thì là, ăn kèm bún và rau thơm',
            hashtags: ['Chả cá', 'Lã Vọng', 'Cá', 'Món Hà Nội'],
            likes: 234,
            comments: 156,
            image: images.featuredFood6
        },
        comments: [
            { user: 'Dũng Lại Lập Trình', text: 'Chả cá này làm sao thơm thế?' },
            { user: 'Nobita', text: 'Nhớ quê quá, lâu rồi không ăn chả cá' }
        ]
    }
];

// Mock data for suggested friends
    export const suggestedFriendsData = [
        {
            id: '1',
            name: 'Dũng Lại Lập Trình',
            commonFriends: 28,
            hashtag: 'Gà'
        },
        {
            id: '2',
            name: 'Chó Kem',
            commonFriends: 28,
            hashtag: 'Món chay'
        },
        {
            id: '3',
            name: 'Lilikama',
            commonFriends: 54,
            hashtag: 'Trứng'
        }
    ];

export const ingredientsData = [
    { id: '1', name: 'Tôm', isSelected: true },
    { id: '2', name: 'Bánh mỳ', isSelected: false },
    { id: '3', name: 'Cá', isSelected: false },
    { id: '4', name: 'Thịt lợn', isSelected: false },
    { id: '5', name: 'Thịt bò', isSelected: false },
    { id: '6', name: 'Trứng', isSelected: false },
    { id: '7', name: 'Gà', isSelected: false },
    { id: '8', name: 'Rau xanh', isSelected: false },
    { id: '9', name: 'Cà chua', isSelected: false },
    { id: '10', name: 'Hành tây', isSelected: false },
    { id: '11', name: 'Tỏi', isSelected: false },
    { id: '12', name: 'Gừng', isSelected: false },
];

export const featuredRecipesData = [
    { id: '1', name: 'Tôm hoàng đế ánh kim', image: images.featuredFood1, time: '3h 30m', likes: 234 },
    { id: '2', name: 'Tôm nướng sốt tiêu đen', image: images.featuredFood2, time: '2h 15m', likes: 189 },
    { id: '3', name: 'Lẩu hải sản với nước sốt tôm', image: images.featuredFood3, time: '1h 45m', likes: 156 },
    { id: '4', name: 'Sò huyết rau mùi', image: images.featuredFood4, time: '1h 20m', likes: 98 },
    { id: '5', name: 'Tôm sốt mắm ớt', image: images.featuredFood5, time: '45m', likes: 267 },
    { id: '6', name: 'Cá nướng lá chuối', image: images.featuredFood6, time: '1h 15m', likes: 189 },
    { id: '7', name: 'Thịt bò xào rau củ', image: images.featuredFood7, time: '30m', likes: 156 },
    { id: '8', name: 'Trứng chiên thịt bằm', image: images.featuredFood8, time: '20m', likes: 123 },
];