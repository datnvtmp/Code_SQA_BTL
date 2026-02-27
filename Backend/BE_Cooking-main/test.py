from groq import Groq

# 1. Định nghĩa Công cụ
tools = [
    {
        "type": "function",
        "function": {
            "name": "getTodayDate",
            "description": "Lấy ngày hiện tại. Hữu ích để trả lời các câu hỏi về ngày hôm nay.",
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    }
]

client = Groq()
completion = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[      
        {        
            "role": "user",        
            "content": "Hôm nay ngày bao nhiêu." # Câu hỏi kích hoạt tool
        }    
    ],
    # Kích hoạt Tool Calling
    tools=tools, 
    # Mặc định là "auto", cho phép LLM tự quyết định
    # tool_choice="auto", 
    
    temperature=1,
    max_completion_tokens=8192,
    top_p=1,
    reasoning_effort="medium",
    stream=True,
    stop=None
)

# 2. Vòng lặp kiểm tra Tool Calls
full_response = ""
for chunk in completion:
    # Kiểm tra xem chunk hiện tại có thông tin gọi công cụ không
    if chunk.choices[0].delta.tool_calls:
        tool_call = chunk.choices[0].delta.tool_calls[0]
        
        # In ra thông tin gọi công cụ
        print("\n--- LLM ĐÃ KÍCH HOẠT TOOL CALLING ---")
        print(f"Tool được gọi: **{tool_call.function.name}**")
        print(f"ID Cuộc gọi: {tool_call.id}")
        # Lưu ý: Tham số (arguments) thường được truyền dưới dạng JSON/string
        if tool_call.function.arguments:
             print(f"Tham số (Arguments): {tool_call.function.arguments}")
        print("--------------------------------------\n")
        
    # Tiếp tục in nội dung còn lại (thường là lời nói đầu, hoặc nội dung sau khi có kết quả tool)
    content = chunk.choices[0].delta.content or ""
    print(content, end="")
    full_response += content

# *LƯU Ý QUAN TRỌNG:*
# Để hoàn tất Tool Calling, bạn cần làm thêm bước 3 là:
# 3. Lấy kết quả từ tool (ví dụ: "2025-12-02") và gửi lại cho LLM
#    bằng một message mới có role="tool" để nó tạo ra câu trả lời cuối cùng.