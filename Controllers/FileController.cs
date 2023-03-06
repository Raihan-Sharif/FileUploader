using FileUploader.Helper;
using Microsoft.AspNetCore.Mvc;

namespace FileUploader.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        private readonly string[] AllowedFileTypes = { "jpg", "jpeg", "png", "gif" };
        private readonly int MaxFileSizeInBytes = 10 * 1024 * 1024;
        static string activeProfile = ConfigurationHelper.Setting("SMSSettings:Active_Profile");
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var fileExtension = Path.GetExtension(file.FileName).ToLower().Replace(".", "");
            if (!AllowedFileTypes.Contains(fileExtension))
            {
                return BadRequest($"Invalid file type. Allowed file types are: {string.Join(", ", AllowedFileTypes)}");
            }

            if (file.Length > MaxFileSizeInBytes)
            {
                return BadRequest($"File size exceeds the limit of {MaxFileSizeInBytes} bytes.");
            }

            var filePath = Path.GetTempFileName();
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            if (fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "png")
            {
                return Ok(new { editUrl = $"/file/edit?filePath={filePath}" });
            }

            return Ok(new { filePath });
        }

        [HttpPost("compress")]
        public async Task<IActionResult> Compress(string filePath)
        {
            // TODO: implement image compression logic
            return Ok(new { filePath });
        }

        [HttpGet("edit")]
        public IActionResult Edit(string filePath)
        {
            // TODO: implement image editing UI
            return Ok();
        }
    }

}
