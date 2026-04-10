const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const pLimit = async () => (await import('p-limit')).default;
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());

const parser = new Parser();
const feeds = [
  'https://tieudungvietnam.vn/rss/an-uong.rss',
  'https://tieudungvietnam.vn/rss/mon-an-ngon.rss',
  'https://misstamkitchenette.com/feed/'
];
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'cooking_db',
  waitForConnections: true,
  connectionLimit: 10
});
// Giới hạn fetch song song
let limit;

(async () => {
  const pLimitFn = await pLimit();
  limit = pLimitFn(10);
})();


// Hàm fetch ảnh nếu không có enclosure
async function fetchImageFromArticle(url) {
  try {
    const { data: html } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(html);
    let img = $('article img').first().attr('src') || $('img').first().attr('src');
    return img || null;
  } catch (err) {
    console.error('Failed to fetch article image:', url, err.message);
    return null;
  }
}

app.get('/api/rss-amthuc', async (req, res) => {
  try {
    const allItems = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const recentItems = feed.items.slice(0, 10); // Chỉ lấy 5 bài gần nhất

        const itemsWithImages = await Promise.all(
          recentItems.map(item =>
            limit(async () => {
              const image = item.enclosure?.url || await fetchImageFromArticle(item.link);
              return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                contentSnippet: item.contentSnippet,
                image
              };
            })
          )
        );

        allItems.push(...itemsWithImages);
      } catch (err) {
        console.error(`Failed to fetch feed: ${feedUrl}`, err.message);
      }
    }

    // Sắp xếp tất cả bài theo ngày mới nhất
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Chỉ trả về 10 bài mới nhất tổng cộng
    res.json(allItems.slice(0, 10));
  } catch (err) {
    console.error('Error fetching feeds', err.message);
    res.status(500).json({ error: 'Không lấy được dữ liệu RSS' });
  }
});


// ====== 1️⃣ API LẤY BANNER ======
app.get('/api/banners', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, imageUrl, title, subTitle
      FROM banners
      WHERE isActive = 1
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi lấy banner' });
  }
});

// ====== 2️⃣ API VIDEO NỔI BẬT ======
app.get('/api/featured-videos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, youtubeUrl, thumbnail
      FROM featured_videos
      WHERE isActive = 1
      ORDER BY createdAt DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi lấy video nổi bật' });
  }
});

// ====== 3️⃣ API NỘI DUNG GIỚI THIỆU ======
app.get('/api/about', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, content, imageUrl
      FROM about_pages
      WHERE isActive = 1
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi lấy nội dung giới thiệu' });
  }
});


app.get("/api/food-suggestions", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM food_suggestions
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("FOOD SUGGESTIONS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.get('/api/calories', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        slug,
        category,
        calories,
        protein,
        fat,
        carb,
        serving_size,
        image_url
      FROM foods
      WHERE status = 'published'
      ORDER BY category ASC, name ASC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('CALORIES ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy dữ liệu calo'
    });
  }
});


app.listen(3001, () => console.log('Server running on port 3001'));
