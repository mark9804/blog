---
title: 用 Python 计算明日方舟 2021 龙门幸运墙期望
createdAt: 1611849711000
tags:
  - 明日方舟
  - Python
  - 暴力搜索
---

# 用 Python 计算明日方舟 2021 龙门幸运墙期望

按照去年的惯例，方舟今年春节的时候也整了个红包盲盒。

![官方对幸运墙活动的描述](https://cdn.sa.net/2024/11/25/poS9lOhx3mf5PTg.webp)

比起去年简单粗暴的直接送，今年的盲盒实际上增加了两层隐性的保底机制：第一层是每天有两次机会而非一次，两次尝试取收益更高的结果；第二层是如果不幸成为了开出小红包的天选之人，第二天追加一次开包机会。这种保底机制使得在今年的活动里玩家几乎不可能吃到最大的那层低保（我模拟了一亿次没模拟出来），但是也使得用纯数学方式计算期望变得极其复杂。

但是作为一个高数挂过一次的人我也不可能硬算啦……因此这次我使用暴力美学，用计算机跑他个几百万次，跑出来的结论就可以近似看作期望了。 顺便为了测试一下 B 站新搞的代码块好不好用，我这次在文中把代码贴出来试试看。

## 基础档位

首先可以看出玉有六个档位：`200`/`300`/`400`/`500`/`600`/`800`。可以用 2.5 种方式确定档位：设置好每个档位对应的玉的数量，对档位进行随机，随后将档位换算成对应玉的数量；直接对六个玉的数量进行随机抽取；或者对 2-8 进行随机，如果出现 7 则舍去该结果再次随机直到出现到几个数字中的一个为止，最后再将结果乘以 100。第一和二种方式本质上没什么区别，但第三种因为玉的数量没有 700 这个档位，这么做的话稍微有点点傻……

我选择的是第一种方式，用字典记录六个档位对应的奖励，然后对档位进行随机抽取。

```python
import random
from collections import Counter

gacha_items = {
    1: 200,
    2: 300,
    3: 400,
    4: 500,
    5: 600,
    6: 800,
}


def gacha_roll():
    item_level = random.randint(1,6)
    return int(gacha_items[item_level])
```

## 流程分析与实现

每一天的流程很简单：开第一个包 → 开第二个包 → 根据前一天的开包情况决定有没有第三个包 → 取最大值 → 进入下一天。

但是实现“开第三个包”的方式有很多。最笨的实现当然可以根据鹰语的描述，用 400 与前一天的结果进行比较来决定第三个包是否存在，但是我选择了一种对人类比较友好的方式：立一个“需要抽第三次”的 flag，该 flag 在第一天的默认值是 False，在随后每天两次抽取结束后将会检查 flag 的状态，如果为真，则抽取第三次；如果为假，则认为第三次抽取到的玉数量为 0。执行完这一分支后将再次判断今天的收获，如果小于 400，则将 flag 反转为真，反之则翻转为假，进入第二天。详细代码如下：

```python
def total_jade(trial_time):
    additional_trial = False # 保底flag，每次检查之后会被翻转回False状态
    jadesum_total = 0 # 总合成玉数量
    backup_time = 0 # 计算保底次数
    global all_results
    for trial_num in range(1, trial_time + 1): # range函数的实际取值范围是[start, end)，默认step为1，因此需要+1
        jadesum_total_per_trial = 0
        for day in range(1,15): # +1理由同上
            trial1 = gacha_roll()
            trial2 = gacha_roll()
            if additional_trial is True:
                trial3 = gacha_roll()
                additional_trial = False
            else:
                trial3 = 0
            daily_sum = max(trial1, trial2, trial3)
            jadesum_total_per_trial += daily_sum
        if daily_sum < 400:
            additional_trial = True
            backup_time = backup_time + 1
        else:
            additional_trial = False
```

## 计算期望并输出

计算期望就是总共获得的玉除以总尝试次数这个没什么好说的，主要核心在怎么写流程……因此直接上代码。

```python
     # 接着上面的所以这里有缩进
        jadesum_total += jadesum_total_per_trial
        expection = jadesum_total / trial_time
    print ('总尝试次数' + str(trial_time) + '次; 所有尝试总共获得合成玉' + str(jadesum_total) + '; 根据尝试次数推算获得期望为' + str(expection))
    backup_rate = (backup_time / trial_time) * 100
    print('吃保底次数' + str(backup_time) + '次, 保底率' + str(backup_rate) + '%')
    most_lucky = max(all_results)
    most_unlucky = min(all_results)
    print('欧皇最多获得了' + str(most_lucky) + '个合成玉; 非酋最少获得了' + str(most_unlucky) + ' 个合成玉, 相差' + str(most_lucky - most_unlucky))
```

## 输出每次尝试获得的玉总数和对应频数

在脚本的一开始我定义了一个名为`all_results`的空列表来存储每次尝试（跑完 14 天后的总数）的结果。在 Python 当中可以直接调用`min`和`max`函数对整个列表中的数据进行取最大值和最小值操作，也可以在导入`collections.Counter`模组之后很方便的统计频数。（注意：`Counter()`的结果不能直接拿来用）

因为我需要计算频数，所以我需要这个列表。如果没有这个需求的话，直接存储上一次尝试的结果，然后把这一次尝试的结果和上一次进行两两比较，然后舍弃掉不要的那个结果。这样可以占用更少的系统资源。（但是都用 python 了……）

因为我的 python3.9 好像装不上 matplotlib，我也懒得折腾，所以就把文件导出成了csv之后扔进了 SPSS。

```python
def save_frequency():
    frequency = Counter(all_results).most_common()
    with open('jadetrials_data.csv', 'a') as file_csv:
        file_csv.write('Jadesum,Frequency\n')
        for frequency_tuple in frequency:
            jadesum, freq = frequency_tuple
            file_csv.write(str(jadesum) + ',' + str(freq) + '\n')
        file_csv.close()
```

## 完整代码和结果

把其他框架部分补充完整之后，试着跑他个一百万次。

![一百万次结果的期望大约稳定在8100](https://cdn.sa.net/2024/11/25/rg8QUt2iKpvMs4l.webp)

我也尝试了一下跑一亿次，好家伙给我跑了一个小时……

![一亿次结果](https://cdn.sa.net/2024/11/25/CsoQ8mMWfhATzOK.webp)

把解释器换成 pypy 之后，总运行时间得到了惊人的提升。

![这运行时间是假的吧](https://cdn.sa.net/2024/11/25/KFfZzwk3GSvVeam.webp)

就当我直呼 pypy yes 的时候我发现哪里不对劲，仔细一看发现小数点后的结果全被舍掉了……

pypy：别扯什么准确了，你就说我算得快不快吧！

但是至少从这两亿次结果可以看出来，想要吃到 2800 的天选保底，难度还真挺大……

像极了大学期末考老师拼命捞人的样子。

:::details 点击展开完整代码

```python
# 修改最后一行括号里的数值更改尝试次数
import random
from collections import Counter

gacha_items = {
    1: 200,
    2: 300,
    3: 400,
    4: 500,
    5: 600,
    6: 800,
}
all_results = [] # 保存每次结果用于导出频数以及计算最大最小值

def gacha_roll():
    item_level = random.randint(1,6)
    return int(gacha_items[item_level])

def total_jade(trial_time):
    additional_trial = False # 保底flag，每次检查之后会被翻转回False状态
    jadesum_total = 0 # 总合成玉数量
    backup_time = 0 # 计算保底次数
    global all_results
    for trial_num in range(1, trial_time + 1): # range函数的实际取值范围是[start, end)，默认step为1，因此需要+1
        jadesum_total_per_trial = 0
        # print('\nTrial ' + str(trial_num))
        for day in range(1,15): # +1理由同上
            trial1 = gacha_roll()
            trial2 = gacha_roll()
            if additional_trial is True:
                trial3 = gacha_roll()
                additional_trial = False
            else:
                trial3 = 0
            daily_sum = max(trial1, trial2, trial3)
            jadesum_total_per_trial += daily_sum
            # print('Day ' + str(day) + ': ' + str(trial1) + ', ' + str(trial2) + ', ' + str(trial3) + ', ' + str(daily_sum))
            # print('Total = ' + str(jadesum_total_per_trial))
        if daily_sum < 400:
            additional_trial = True
            backup_time = backup_time + 1
        else:
            additional_trial = False
        all_results.append(jadesum_total_per_trial)
        jadesum_total += jadesum_total_per_trial
        expection = jadesum_total / trial_time
    print ('总尝试次数' + str(trial_time) + '次; 所有尝试总共获得合成玉' + str(jadesum_total) + '; 根据尝试次数推算获得期望为' + str(expection))
    backup_rate = (backup_time / trial_time) * 100
    print('吃保底次数' + str(backup_time) + '次, 保底率' + str(backup_rate) + '%')
    most_lucky = max(all_results)
    most_unlucky = min(all_results)
    print('欧皇最多获得了' + str(most_lucky) + '个合成玉; 非酋最少获得了' + str(most_unlucky) + ' 个合成玉, 相差' + str(most_lucky - most_unlucky))

def save_frequency():
    frequency = Counter(all_results).most_common()
    with open('jadetrials_data.csv', 'a') as file_csv:
        file_csv.write('Jadesum,Frequency\n')
        for frequency_tuple in frequency:
            jadesum, freq = frequency_tuple
            file_csv.write(str(jadesum) + ',' + str(freq) + '\n')
        file_csv.close()

if __name__ == '__main__':
    total_jade(10000000000)
    # save_frequency() # 反注释此行获取每次尝试的频度分布
```

:::

## 进一步分析：你是什么等级的欧皇？

根据上面的 1 亿次模拟结果，我们可以画出频数分布图。

![频数分布图](https://cdn.sa.net/2024/11/25/GjDV1hNaCAWxItm.webp)

从频数分布图上来看应该是~~正太~~正态分布，没关系，根据大数定律和中心极限定律，它不是也得是。

基于样本正态分布的假设，我们就可以计算它的平均值和标准差（sd）了。

![用 R 计算平均值和标准差](https://cdn.sa.net/2024/11/25/RkW7f5YzVqXPNl8.webp)

得到平均值为 `8304`，标准差为 `602` 之后，我们可以根据正态分布相关的知识得出自己的欧非水平。

![分布估算](https://cdn.sa.net/2024/11/25/iHcvAk5CzKulMVB.webp)

## 等等！还有话说……

概率学的每一个偏差落到一个人头上就是一座大山.jpg

![天 选 非 酋](https://cdn.sa.net/2024/11/25/cMIbtBPurO2YhGU.webp)
