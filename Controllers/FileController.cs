using FileUploader.Helper;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace FileUploader.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class FileController : ControllerBase
    {
        private readonly string[] AllowedFileTypes = ConfigurationHelper.SettingList("ConfigSettings:FileUpload:Allowed_Types");

        private IWebHostEnvironment env;
        public FileController(IWebHostEnvironment env)
        {
            this.env = env;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm]IFormFile file)
        {

           // string _AllowedFileTypes = ConfigurationHelper.Setting("ConfigSettings:FileUpload:Allowed_Types");

            string folderPath = string.Empty;
            int MaxFileSizeInBytes = 0;
            string fileName = string.Empty;

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var fileExtension = Path.GetExtension(file.FileName).ToLower().Replace(".", "");
            if (!AllowedFileTypes.Contains(fileExtension))
            {
                return BadRequest($"Invalid file type. Allowed file types are: {string.Join(", ", AllowedFileTypes)}");
            }

            if (fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "png" || fileExtension == "gif")
            {
                MaxFileSizeInBytes = Convert.ToInt32(ConfigurationHelper.Setting("ConfigSettings:FileUpload:Max_Img_Size"));
                folderPath = ConfigurationHelper.Setting("ConfigSettings:FileUpload:Image_Path");

             //   return Ok(new { editUrl = $"/file/edit?filePath={filePath}" });
            }
            else
            {
                MaxFileSizeInBytes = Convert.ToInt32(ConfigurationHelper.Setting("ConfigSettings:FileUpload:Max_File_Size"));
                folderPath = ConfigurationHelper.Setting("ConfigSettings:FileUpload:File_Path");
            }

            if (file.Length > MaxFileSizeInBytes)
            {
                return BadRequest($"File size exceeds the limit of {MaxFileSizeInBytes} bytes.");
            }

            //using (var stream = new FileStream(folderPath, FileMode.Create))
            //{
            //    await file.CopyToAsync(stream);
            //}

            string uniqueFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ".txt";

            folderPath = env.WebRootPath + folderPath;
            fileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + file.FileName;
            // Create the directory if it doesn't already exist
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Combine the folder path and file name to create the full file path
            string filePath = Path.Combine(folderPath, fileName);

            // Write the file data to the server using a FileStream
            using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
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
