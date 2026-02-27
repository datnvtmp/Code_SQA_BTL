import { images } from "@/constants";

export const messagesData = [
    {
      id: '1',
      title: 'Bạn bếp',
      messages: [
        {
          id: '1',
          userName: 'Otaku Lê',
          message: 'Bạn ơi rep ib mình với',
          unreadCount: 2,
          
        },
        {
          id: '2',
          userName: 'Nobita',
          message: 'M chế ra món đell gì vậy?',
          unreadCount: 99,
          
        },
        {
          id: '3',
          userName: 'Wibu Chúa',
          message: 'Lô cc',
          unreadCount: 3,
          
        },
        {
          id: '4',
          userName: 'Mun Ngáo',
          message: 'Hello my dinner',
          unreadCount: 5,
          
        },
        {
          id: '5',
          userName: 'Bạn bếp 1',
          message: 'Hello my dinner',
          unreadCount: 12,
          
        },
        {
          id: '6',
          userName: 'Bạn bếp 2',
          message: 'Hello my dinner',
          unreadCount: 15,
          
        },
        {
          id: '7',
          userName: 'Bạn bếp 3',
          message: 'Hello my dinner',
          unreadCount: 1,
          
        },
      ],
    },
    {
      id: '2',
      title: 'Người lạ',
      messages: [
        {
          id: '8',
          userName: 'Bạn lạ 1',
          message: 'Bạn ơi rep ib mình với',
          hasNotificationDot: true,
          
        },
        {
          id: '9',
          userName: 'Bạn lạ 2',
          message: 'Bạn ơi rep ib mình với',
          hasNotificationDot: true,
          
        },
        {
          id: '10',
          userName: 'Bạn lạ 3',
          message: 'Bạn ơi rep ib mình với',
          hasNotificationDot: true,
          
        },
      ],
    },
  ];

export const notificationsData = [
    {
        id: '1',
        title: 'Hôm nay',
        notifications: [
            {
                id: '1',
                avatarUrl: images.sampleAvatar,
                userName: 'Otaku Lê',
                content: 'đã thêm một công thức mới',
                timestamp: '14:30 - 05/09/2023',
            },
            {
                id: '2',
                avatarUrl: images.sampleAvatar,
                userName: 'Nobita',
                content: 'đã bình luận vào công thức của Bạn "Nấu món này lâu vcl"',
                timestamp: '7:30 - 04/09/2023',
            },
            {
                id: '3',
                avatarUrl: images.sampleAvatar,
                userName: 'Nobita',
                content: 'đã yêu thích công thức của Bạn',
                timestamp: '14:30 - 03/09/2023',
            },
        ],
    },
    {
        id: '2',
        title: 'Trước đó',
        notifications: [
            {
                id: '4',
                avatarUrl: images.sampleAvatar,
                userName: 'Wibu Chúa',
                content: 'đã yêu thích bình luận của Bạn',
                timestamp: '14:30 - 05/08/2023',
            },
            {
                id: '5',
                avatarUrl: images.sampleAvatar,
                userName: 'Wibu Chúa',
                content: 'đã trả lời bình luận của Bạn "MDark dark burh burh lmao"',
                timestamp: '14:30 - 05/08/2023',
            },
            {
                id: '6',
                avatarUrl: images.sampleAvatar,
                userName: 'Nobita',
                content: 'đã thêm một công thức mới',
                timestamp: '7:30 - 04/09/2023',
            },
            {
                id: '7',
                avatarUrl: images.sampleAvatar,
                userName: 'Mun Ngáo',
                content: 'đã thêm một bí quyết mới',
                timestamp: '14:30 - 03/09/2023',
            },
            {
                id: '8',
                avatarUrl: images.sampleAvatar,
                userName: 'Otaku Lê và Nobita',
                content: 'đã bình luận vào công thức của Bạn',
                timestamp: '14:30 - 05/09/2023',
            },
            {
                id: '9',
                avatarUrl: images.sampleAvatar,
                userName: 'Mun Ngáo',
                content: 'đã thêm một bí quyết mới',
                timestamp: '14:30 - 03/09/2023',
            },
            {
                id: '10',
                avatarUrl: images.sampleAvatar,
                userName: 'Mun Ngáo',
                content: 'đã thêm một bí quyết mới',
                timestamp: '14:30 - 03/09/2023',
            },
            {
                id: '11',
                avatarUrl: images.sampleAvatar,
                userName: 'Mun Ngáo',
                content: 'đã thêm một bí quyết mới',
                timestamp: '14:30 - 03/09/2023',
            },
        ],
    },
];