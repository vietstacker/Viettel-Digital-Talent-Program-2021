using System;
using Xunit;

namespace UnitTestv1
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            Assert.Equal(1+1, 2);
        }

        [Theory(DisplayName = "Add New Resource List")]
        [InlineData("RL1")]
        public void TestAdd(string expectedName)
        {
            Assert.Equal(expectedName, "RL1");
        }

        [Theory(Skip = "Skip this method test")]
        [InlineData("RL1")]
        public void TestSkipAdd(string expectedName)
        {
            Assert.Equal(expectedName, "RL2");
        }
    }
}
