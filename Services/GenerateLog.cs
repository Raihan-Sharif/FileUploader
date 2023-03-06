using FileUploader.Helper;

namespace FileUploader.Services
{
    public static class GenerateLog
    {
        /// <summary>
        /// In case exception raised by system
        /// </summary>
        /// <param name="ex"></param>
        public static void WriteExceptionLog(Exception ex)
        {
            StreamWriter? sw = null; long Line_No = 1;

            try
            {
                ConfigurationHelper.Setting("SMSSettings:SMS_LOG_PATH");
                DirectoryInfo di = new DirectoryInfo(ConfigurationHelper.Setting("SMSSettings:SMS_LOG_PATH") + "LOG");
                if (!di.Exists)
                    di.Create();

                string path = ConfigurationHelper.Setting("SMSSettings:SMS_LOG_PATH") + "LOG\\";

                path += "ErrorLogFile" + System.DateTime.Today.ToString("dd_MMM_yyyy") + ".log";

                FileInfo fi = new FileInfo(path);
                if (fi.Exists)
                {
                    Line_No = CountLinesInFile(path);
                    sw = new StreamWriter(path, true);
                }
                else
                    sw = new StreamWriter(path, false);

                sw.WriteLine(Line_No + ". " + DateTime.Now.ToString() + ": " + ex.Source.ToString().Trim() + "; " + ex.Message.ToString().Trim());
                sw.Flush();
                sw.Close();
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// In case error sending on SMS
        /// </summary>
        /// <param name="ex"></param>
        public static void WriteErrorLog(String sErrorMsg)
        {
            StreamWriter? sw = null; long Line_No = 1;
            try
            {
                DirectoryInfo di = new DirectoryInfo(ConfigurationHelper.Setting("SMSSettings:SMS_LOG_PATH") + "LOG");
                if (!di.Exists)
                    di.Create();

                string path = ConfigurationHelper.Setting("SMSSettings:SMS_LOG_PATH") + "LOG\\";

                path += "ErrorLogFile" + System.DateTime.Today.ToString("dd_MMM_yyyy") + ".log";

                FileInfo fi = new FileInfo(path);
                if (fi.Exists)
                {
                    Line_No = CountLinesInFile(path);
                    sw = new StreamWriter(path, true);
                }
                else
                    sw = new StreamWriter(path, false);

                sw.WriteLine(Line_No + ". " + DateTime.Now.ToString() + ": " + sErrorMsg.ToString());
                sw.Flush();
                sw.Close();
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// SMS log
        /// </summary>
        /// <param name="Message"></param>
        public static void WriteSMSLog(string Message)
        {
            StreamWriter? sw = null; long Line_No = 1;
            string path = ConfigurationHelper.Setting("SMSSettings:SMS_LOG_PATH") + "LOG\\";

            try
            {
                DirectoryInfo di = new DirectoryInfo(path);
                if (!di.Exists)
                    di.Create();

                path += "SmsLogFile_" + System.DateTime.Today.ToString("dd_MMM_yyyy") + ".log";

                FileInfo fi = new FileInfo(path);
                if (fi.Exists)
                {
                    Line_No = CountLinesInFile(path);
                    sw = new StreamWriter(path, true);
                }
                else
                    sw = new StreamWriter(path, false);


                sw.WriteLine(Line_No + ". " + DateTime.Now.ToString() + ": " + Message);
                sw.Flush();
                sw.Close();
            }
            catch (Exception ex)
            {
                WriteExceptionLog(ex);
            }
        }
        /// <summary>
        /// Count the number of lines in the file specified.
        /// </summary>
        /// <param name="f">The filename to count lines.</param>
        /// <returns>The number of lines in the file.</returns>
        static long CountLinesInFile(string f)
        {
            long count = 1;
            StreamReader Sr = null;
            using (Sr = new StreamReader(f))
            {
                string line;
                while ((line = Sr.ReadLine()) != null)
                {
                    count++;
                }
            }
            Sr.Dispose();
            Sr.Close();

            return count;
        }
    }
}
