# ISO8583LogPARSE
A utility I wrote while at Blackhawk Network that translates log entries written in <a href="https://en.wikipedia.org/wiki/ISO_8583">ISO 8583</a> format, the standard for financial card information exchange, into something people could unsterstand without having to learn the spec.
<p>
The first version of this was written as a Bash shell script where someone would put the log entry into a seperate file which was then read by the script. This worked for me but not for other people who learned of the script but didn't have Linux experiance or shell access so couldn't use it. I rewrote this as the JavaScript app you see here.
<p>
You can run the <a href="https://cdn.rawgit.com/ronnycorral/ISO8583LogPARSE/b1395f9e/logparse.html">demo</a> which includes a sample log entry.
