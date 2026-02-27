-CHƯA TEST FOLLOWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
- KHI SET RECIPE TỪ PUBLIC VỀ PRIVATE NHỚ UPDATE LẠI COLLECTIONNNNN -> thôi, trong collection service sửa lại các cái không hợp lệ bằng place holder rồi hê

-mới đổi đếm save từ collectrepo -> collectRecipeRepo -> check
check thêm hàm đếm save trong collect repo (dùng trong @aftermatch detail recipe (recipemapper))

đổi difficalty trong create thanh notnull và sửa hardcore trong create recipe service
- cân nhắc dùng Meilisearch
- Unique constraint: Trong RecipeIngredient, bạn có @UniqueConstraint(columnNames = { "recipe_id", "ingredient_id" }) – tốt, nhưng vì ingredient_id nullable, nó chỉ unique khi có link. Nếu user nhập 2 rawName giống nhau (không link), sẽ duplicate. Gợi ý: Thêm unique trên {recipe_id, rawName} (lowercase/normalized) để tránh lặp, hoặc dùng soft unique qua business logic.
tf8mb4_unicode_ci
 cho tiếng việt ??? (GPT for more inf)

 ĐỔI PLACE HOLDER TRONG 2 API GỢI Ý Ở TRANG CHỦ VÀ GỢI Ý KẾT BẠN (TỔNG 3 API)
 10:12/20/11/25: vừa thêm recipeview.java, chuẩn bị trả về recipesummary có thêm last view.
