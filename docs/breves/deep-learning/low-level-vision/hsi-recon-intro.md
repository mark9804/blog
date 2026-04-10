---
title: 高光谱重建任务入门
description: 高光谱图像重建 (Hyperspectral Image Reconstruction, HSIR) 任务基础
tags:
  - 深度学习
  - low-level vision
  - 高光谱重建
cover: https://i.see.you/2026/03/25/s7gM/pic_1774433740249.jpg
---

# 高光谱重建任务入门

最近刚投完稿（虽然大概率是当分母的），就想在这段还不算太忙的空闲时间里把这段时间里对高光谱重建任务的理解记录下来，一方面作为这段时间的思路整理，另一方面也希望能帮助到刚入门的同学。

## 任务背景

一般相机拍摄的图像包含了红、绿、蓝三个波段的信息，然而在很多时候，即使是材质完全不同的物体，也有可能在相机中呈现类似的颜色。而高光谱图像包含了数百个连续的窄波段信息，能够提供比 RGB 图像丰富得多的空间和光谱信息，因此在遥感（地表图像拍摄、天气预测）、农业（病果病株检测）、医疗（病灶检测）等多种领域均可得到应用[^yuanSnapshotCompressiveImaging2021a]，甚至在自动驾驶任务上也能小蹭一手[^shahHyperspectralSensorsAutonomous2026]。

理论上这么好的一项技术应该被迅速铺开，但现实情况是高光谱成像即使在自家领域——地理遥感上，也花了足足 30 年时间才从实验室走向天空[^goetzThreeDecadesHyperspectral2009]。主要原因无他，传统高光谱相机的成像速度实在是太慢了：摆扫式系统（例如 AVIRIS [^vaneAirborneVisibleInfrared1987]）和推扫式系统（例如 Hyperion [^pearlmanHyperionSpacebasedImaging2003]）可能要花费长达几个小时来拍摄一张图像，直接给传统高光谱成像在需要快速成像的场景应用上判了死刑。

为了解决这个问题，研究者们提出了“快照压缩成像（Snapshot Compressive Imaging, SCI）”技术[^duPrismbasedSystemMultispectral2009][^wagadarikarSingleDisperserDesign2008][^llullCodedApertureCompressive2013][^wagadarikarVideoRateSpectral2009][^yuanCompressiveHyperspectralImaging2015]。其主要构造是利用一组或多组棱镜将获取到的原始高光谱图像在空间上进行压缩，然后利用编码掩模对压缩后的图像进行编码，最后利用单次曝光获取编码后的图像。

![CASSI 成像系统简图 | 来源：[^yuanSnapshotCompressiveImaging2021a]](https://i.see.you/2026/03/25/s7gM/pic_1774433740249.jpg)

SCI 是一系列成像系统的统称，而在这一系列系统当中，上图中的 CASSI (Coded Aperture Snapshot Spectral Imaging)[^gehmSingleshotCompressiveSpectral2007][^wagadarikarSingleDisperserDesign2008] 成像系统由于性能突出，成为了快照压缩成像的主流设备。CASSI 通过一个物理掩膜 $M^{*} \in \mathbb{R}^{H \times W}$ 有选择地让原始高光谱图像（3D HSI Cube，一般标记为 $F \in \mathbb{R}^{H \times W \times N_{\lambda}}$，其中 $H, W, N_{\lambda}$ 分别代表图像的高度、宽度和波段数）上的光线通过，得到调制后的图像 $F' \in \mathbb{R}^{H \times W \times N_{\lambda}}$，然后使用单个色散棱镜以预设的横向间隔将不同波段的图像单次曝光到 2D 传感器上，得到压缩后的测量值（measurement，一般标记为 $Y \in \mathbb{R}^{H \times W}$）。

![CASSI 数据流转图 | 来源：[^caiCoarsetofineSparseTransformer2022]](https://i.see.you/2026/03/25/t1gH/pic_1774437835673.jpg)

通过快照压缩成像技术，我们最高可以实现视频帧率的高光谱成像[^wagadarikarVideoRateSpectral2009]，但是这种做法实际上是把计算复杂度从硬件转移到了算法上：直接拍摄的 2D 测量值 $Y$ 是肉眼无法直接识别的，需要通过算法进行重建才能得到原始的高光谱图像。而这种重建任务就是高光谱重建（Hyperspectral Image Reconstruction, HSIR）。

![HSIR 任务流程示意图，注意这里为了方便理解只放了 RGB 图片](https://i.see.you/2026/03/25/5kIm/pic_1774475696975.jpg)

## 压缩过程的数理模型

我们再把这张图放一次，免得翻来翻去找起来不方便。

![CASSI 数据流转图 | 来源：[^caiCoarsetofineSparseTransformer2022]](https://i.see.you/2026/03/25/t1gH/pic_1774437835673.jpg)

### 空间调制过程：$F \to F'$

这一步是通过物理掩膜 $M^* \in \mathbb{R}^{H \times W}$ 对原始高光谱图像 $F \in \mathbb{R}^{H \times W \times N_{\lambda}}$ 进行空间调制 (Modulation)，得到调制后的图像 $F' \in \mathbb{R}^{H \times W \times N_{\lambda}}$。

可能有人会提出两个疑问：

1. 为什么不直接在 $F$ 上进行 dispersion，而是要先经历一步 modulation 呢？这不是人为地增加计算复杂度和引入导致质量退化的变量了吗？
2. 为什么 $M^*$ 是二维掩膜（$M^* \in \mathbb{R}^{H \times W}$），它能不能是三维的（$M^* \in \mathbb{R}^{H \times W \times N_{\lambda}}$）？

我们一个一个回答。

#### 引入 Mask Modulation 是为了解决一半的光谱维度对称性问题

这里引入一个概念，光谱维度的对称性。它指在未经任何编码调制的常规光学成像系统中，传感器对不同波长光信号的响应在数学投影面上具有不可区分性或高度的线性相关性。

可能听着比较抽象，我们用一个比较直观的例子说明：民用相机传感器前的拜尔滤镜。

![拜尔滤镜 | [Wikipedia](https://zh.wikipedia.org/zh-cn/%E6%8B%9C%E7%88%BE%E6%BF%BE%E8%89%B2%E9%8F%A1)](https://i.see.you/2026/03/31/i8zZ/Frame-12.webp)

传统的传感器（CCD/CMOS）是对宽谱光进行宽频积分的器件，其上的光电二极管本身只能将光子转化为电子，无法对不同波长的光进行区分。因此如果没有这层滤镜（即全透光状态），那么传感器在像素 $(x, y)$ 处获取到的信号 $I(x, y)$ 测量值就变成了对传感器能接收到的所有波段光信号的积分，即

$$I(x, y) = \int_{\lambda_{min}}^{\lambda_{max}} F(x, y, \lambda) d\lambda$$

其中 $\lambda_{min}$ 和 $\lambda_{max}$ 分别代表传感器能接收到的最小和最大波长。这时候我们看到的相机照片会是什么颜色的呢？

答对了，假设传感器在某个单元格 $(x, y)$ 接收到的光子数量 $I(x, y) = 100$ 个，那么由于传感器无法区分这 100 个光子中有多少个是来自红光波段的，多少个是绿光波段的，多少个是蓝光波段的，因此在没有滤镜的情况下，传感器得到的只有明度信息，而没有颜色信息。也就是说如果某台相机没有拜尔滤镜，那么它只能拍摄黑白照片。如果我们给它装上一个拜耳滤镜，由于拜耳滤镜上的红色滤光片只允许红光通过，绿色滤光片只允许绿光通过，蓝色滤光片只允许蓝光通过，我们就可以得到一个三层的掩膜 $M_{Bayer} \in \mathbb{R}^{H \times W \times 3}$，其中每一层分别是针对红光、绿光、蓝光的滤色片形成的掩膜。那么令原始图像的 RGB 立方体为 $F_{RGB} \in \mathbb{R}^{H \times W \times 3}$，我们可以通过 $F_{RGB}$ 和 $M_{Bayer}$ 的哈达玛积（逐元素相乘得到的矩阵）得到 $F_{RGB}'$，即

$$
F_{RGB}'(:, :, n_{\lambda}) = F_{RGB}(:, :, n_{\lambda}) \odot M_{Bayer}(:, :, n_{\lambda}), \quad n_{\lambda} = 1, 2, 3
$$

这个公式描述了使用拜尔滤镜后的效果：光线通过拜尔滤镜后，只有特定波长的光线能够穿过特定位置的滤光片到达传感器的特定位置，从而让只能接受到光强信息的传感器实现对不同波长光信号的区分。虽然从理论上讲，由于透过的光信号中只有一部分能通过滤镜到达传感器，导致传感器针对某个频段的分辨率会下降最多四分之三（以 RGGB 拜尔阵列为例，则只有四分之一的像素点能接收到红光和蓝光信号），但是我们可以以这种牺牲换取传感器对不同波长光信号的区分能力，从而获得彩色图像。也因此部分对色彩信息要求不高，但是对信噪比要求较高（例如在特定工业场景下使用，或者高端民用）的相机产品会直接砍掉拜尔滤镜，用于追求极致的极限的光子捕获效率和空间采样精度。

我们把目光回到 CASSI 上，不难看出它使用 mask 的思路和民用相机使用拜尔滤镜的思路是类似的。**假如**我在传感器前叠加一层对特定波段光信号有选择性吸收的滤镜，我就可以实现对不同波长光信号的区分了。但是且慢，拜尔滤镜为了获取 R，G，B 三个波段的信息就需要三层掩膜 ($M_{Bayer} \in \mathbb{R}^{H \times W \times (n_{R}+n_{G}+n_{B})}$)，照理来说要获取 N 个波段的信息就需要 N 层掩膜，但是 CASSI 为什么只用一个 2D 掩膜 $M^{*} \in \mathbb{R}^{H \times W}$ 就能获得多个波段的光谱信息？是外星科技吗？

#### 本质上只存在一种掩膜，就是 3D 掩膜

外星科技自然是不存在的，任何成像工具都要遵守基本法。我们先假设我们手上有一个 3D 掩膜 $M^* \in \mathbb{R}^{H \times W \times N_{\lambda}}$，那么类似上面的拜尔滤镜，我们可以通过计算高光谱立方体 $F$ 与 $M^*$ 哈达玛积来得到 $F'$，即

$$
F'(:, :, n_{\lambda}) = F(:, :, n_{\lambda}) \odot M^*, \quad n_{\lambda} = 1, 2, \dots, N_{\lambda}
$$

这个公式描述了特定波段的光信号通过针对特定波段透光率不一的 3D 掩膜后的光强变化。从这里依然可以看出，掩膜必须是 3D 的，即 $M^* \in \mathbb{R}^{H \times W \times N_{\lambda}}$。但是现在研究中使用的 2D 掩膜又是怎么回事？这个 2D 掩膜又是怎么得到的？

答案是直到 2020 年之前，高光谱重建领域的研究者们手上根本就没有 3D 掩膜，甚至连使用的 2D 掩膜都是随机生成的。直到 TSA-net [^mengEndtoendLowCost2020TSA] 作者[在论文仓库中放出了](https://github.com/mengziyi64/TSA-Net/tree/master/TSA_Net_realdata/Data)宣称自己是从实际机器上取得的 mask，大家才有得真正的 mask 能用。

听起来很扯，但是这就是事实，我一开始听到的时候也没绷住。但是退一万步说，就算通过取随机数或者其他研究者提供的方式生成了一个 2D mask，那模型真正需要的 3D mask 又要怎么得到呢？随机生成的 mask 千变万化，又怎么能保证对比结果的公平性呢？

关于 3D mask 的获取，我们可以直接看代码。这是高光谱重建领域的重量级选手 Yuanhao Cai 放出的事实性[高光谱重建标准工具链仓库](https://github.com/caiyuanhao1998/MST)，其中的 [utils.py](https://github.com/caiyuanhao1998/MST/blob/main/simulation/train_code/utils.py) 文件开头就有对应的生成 3D mask 的代码：

```python
def generate_masks(mask_path, batch_size):
    mask = sio.loadmat(mask_path + '/mask.mat')
    mask = mask['mask']
    mask3d = np.tile(mask[:, :, np.newaxis], (1, 1, 28))
    mask3d = np.transpose(mask3d, [2, 0, 1])
    mask3d = torch.from_numpy(mask3d)
    [nC, H, W] = mask3d.shape
    mask3d_batch = mask3d.expand([batch_size, nC, H, W]).cuda().float()
    return mask3d_batch
```

停！这好像和说好的不一样，为什么它只是把同一张 2D mask 复制了 28 遍（具体数值与想要重建的光谱波段数相同）？不是说好了应该有 28 层不同的 mask 吗？如果每层的 mask 都一样的话，那还是没有解决光谱维度对称性的问题呀？

先别急，我们上面提到“引入 Mask Modulation 是为了解决**一半**的光谱维度对称性问题”，那这不还剩下一半要放到接下来的色散过程中解决么。

### 色散过程：$F' \to F''$

色散过程 (Dispersion) 是我个人认为 CASSI 设计中最具巧思的部分。它利用了棱镜对不同波长光线折射率不同的物理特性，将原本在空间维度上叠加的光谱信息分离开来，使得整个 CASSI 系统成为了一个能够捕获线性连续波长光线的成像系统。

为什么这么说呢？我们先来考虑一下如果我们照抄拜尔滤镜的思路会怎么样：如果我们要捕获 R, G, B 三个波段的信息，我们就需要在掩膜上镶嵌红色、绿色、蓝色的滤色片，在这个过程中每个波段透过的光量会被吸收到只剩下原本强度的四分之一到二分之一；如果我们要捕获 28 个波段的光信号，那么我们就需要镶嵌 28 种不同的滤色片——先假设工厂确实能实际生产出这么精细的滤色片，哪怕我们把这种掩膜做出来了，每个波段的光信号在通过掩膜后，其强度也会被削弱到原本的 1/28 甚至更低，这对成像系统而言是灾难性的。因为这意味着传感器需要捕捉更长的时间才能获得足够的光信号，这不仅会增加成像系统的功耗，曝光过程中持续累积的热噪声和随机噪声还会降低成像系统的信噪比。其次，如果我们真的排除万难使用上了这种掩膜，整个成像系统也就被固定了只能拍摄掩膜允许通过的若干波段，如果我们需要拍摄其他波段的光谱信息，就只能重新设计和制造新的掩膜，替换掉旧的掩膜，让本就相对昂贵的高光谱成像设备的价格更上一层楼。因此使用掩膜来控制光信号的波段信息是不可取的，需要另辟蹊径。

#### 利用棱镜实现光谱分离

我们都知道阳光在透过三棱镜之后会形成色散，这是因为不同波长的光在棱镜中的折射率不同，从而导致它们在空间维度上发生偏转。更详细地说，棱镜介质对不同波长光的折射率 $n(\lambda)$ 满足[柯西色散经验公式](https://en.wikipedia.org/wiki/Cauchy%27s_equation)：

$$n(\lambda) = A + \frac{B}{\lambda^2} + \frac{C}{\lambda^4} + \dots$$

其中 $A, B, C$ 是与棱镜材料相关的经验常数（无实际物理意义），$\lambda$ 是光的波长。感兴趣的读者可以查看[这个知乎回答](https://www.zhihu.com/question/23436983/answer/31586141)，它从平面波方程开始完整推导了一遍柯西色散公式。

> PS：柯西经验公式是一个近似公式，只在可见光范围内精度较高，在红外和紫外光下需要使用基于柯西公式进一步扩展得到的 [Sellmeier 方程](https://en.wikipedia.org/wiki/Sellmeier_equation)。但是这和我们的话题相比过于硬核了，感兴趣自行了解即可

在 CASSI 系统中，完成掩膜调制后的光信号会经过一个薄棱镜，光线在棱镜中发生色散，产生不同的出射角度。由于不同波长的光线在棱镜中发生色散的程度不同，并且由上述经验公式可知这种色散程度只会与棱镜材料与波长有关，因此在棱镜材料固定的情况下，不同波长的光线的出射角度也是各不相同但偏移量固定的，其照射到成像传感器上特定焦平面的位置也会发生偏移。通过使用激光完成的物理标定，我们可以以一个固定的偏移量 $d$ 来表示不同波长的光线在空间维度上的偏移量，也就是这一步的公式中会出现的平移步长。

:::details 选读：CASSI 系统中平移步长的推导

单纯知道“不同波长的光线通过棱镜后的散射角度不同”这一定性结论并不足以让我们有足够信息来设计 CASSI 系统，我们还需要知道不同波长的光线在空间维度上具体偏移了多少，也就是平移步长 $d$。

我们假设被摄物体发出的光线是混合光（废话），这束复合光以入射角 $\theta_{i1}$ 射入顶角为 $\alpha$ 的棱镜，并且在棱镜的两个面上经历两次折射，在棱镜内部经历一次全反射。

![折射光路示意图 | [南昌大学基础物理实验中心](http://wlsyzx.ncu.edu.cn/docs/2022-03/53e67b13a67b42469da5dce6ed904f8c.pdf) =240x](https://i.see.you/2026/04/01/3uAl/1Capture_2026-04-01_104528.webp)

对于第一次折射，根据 Snell's law，我们有

$$
\sin\theta_{i1} = n(\lambda)\sin\theta_{i2},
$$

其中 $\theta_{i2}$ 是光线在棱镜中的折射角。

又根据几何关系，光线到达第二面的入射角 $\theta_{i3}$ 与 $\theta_{i2}$、$\alpha$ 的关系满足 $\theta_{i3} + \theta_{i2} = \alpha$。

对于第二次折射，根据 Snell's law，又有

$$
n(\lambda)\sin\theta_{i3} = \sin\theta_{i4},
$$

其中 $\theta_{i4}$ 是光线射出棱镜后的折射角。综合各式，我们可以得到对于特定波长的光线，其出射光线与入射光线形成的总偏转角 $\delta(\lambda)$ 为

$$
\delta(\lambda) = \theta_{i1} + \theta_{i4} - \alpha.
$$

而对于 CASSI 系统中常使用的薄棱镜（顶角 $\alpha$ 较一般三棱镜小，比如 30°），且光线以近乎垂直的角度入射的情况时，我们可以对上述方程进行一阶泰勒展开近似，得到 $\sin\theta \approx \theta$，此时 Snell's law 会退化为

$$
\begin{cases}
\theta_{i1} \approx n(\lambda)\theta_{i2}, \\
n(\lambda)\theta_{i3} \approx \theta_{i4}.
\end{cases}
$$

代入总偏转角公式，可得薄棱镜的偏转角近似公式

$$
\delta(\lambda) \approx (n(\lambda) - 1)\alpha.
$$

由于 $n(\lambda)$ 随波长非线性变化，偏转角 $\delta(\lambda)$ 也随波长非线性变化，这意味着不同波长的光线在空间维度上发生偏转的角度不同，形成了光谱分离的几何基础。

更进一步，在 CASSI 系统中，光线经过棱镜产生角度偏转 $\delta(\lambda)$ 后，通常会经过一个焦距为 $f$ 的中继透镜后投射到成像传感器的焦平面上。我们假设参考中心波长 $\lambda_{c}$ 的偏转角为 $\delta(\lambda_c)$，其在传感器焦平面上的落点坐标为 $y_c$。则任意波长 $\lambda_n$ 在传感器上的落点坐标 $y(\lambda_n)$ 为

$$
y(\lambda_n) = f \cdot \tan(\delta(\lambda_n))
$$

又由于偏转角的差异 $\Delta \delta = \delta(\lambda_n) - \delta(\lambda_c)$ 通常非常小，因此我们可以再次进行线性化。

对于 $y(\lambda)$，其在 $\lambda_c$ 处的泰勒展开为

$$
y(\lambda_n) \approx y(\lambda_c) + \left( \left. \frac{dy}{d\lambda} \right|_{\lambda_c} \right) (\lambda_n - \lambda_c)
$$

在这里可以看到，$\left. \frac{dy}{d\lambda} \right|_{\lambda_c}$ 就是一个仅由棱镜材料色散率和系统焦距决定的波长无关的常数，也就是 CASSI 系统中的平移步长 $d$。

:::

假设一束混合光通过掩膜之后照射到棱镜上的坐标为 $(x, y)$，则经过掩膜调制后不同波长的光线后射出到成像传感器上形成的坐标集合 $F''(u, v, n_\lambda)$ 可以表示为

$$
F''(u, v, n_\lambda) = F'(x, y + d(\lambda_n - \lambda_c), n_\lambda),
$$

其中那个 $\lambda_c$ 是参考波长，$\lambda_n$ 是第 $n$ 个波长。

现在让我们回到前面的问题：如果每层的 mask 都一样，在加入色散棱镜之前，光谱对称性的问题依然没有得到解决。但是在加入了色散棱镜之后，由于不同波长的光线的出射角不同，因此根据简单的几何原理我们就可以得知，不同波长的光线在成像传感器上的落点坐标也不同。并且由于棱镜的色散是线性连续的，因此通过掩膜+棱镜的方式，CASSI 系统就实现了将任意波长光线在空间维度上的分离，也不再需要制造被花花绿绿的滤光片嵌成筛子的类拜尔滤镜了。

##### 平移步长是固定的，捕获的光谱波长差是固定的吗？

这里又要有好学的同学问了，既然在色散过程中，相邻波长频段的光线在成像传感器上的落点偏移量是一个定值，那么捕获的相邻频段的光线波长差是否也是一个定值呢？

显然不是，根据相似三角形的原理我们就可以知道在距离焦平面距离 $y$ 一定的情况下，出射角 $\delta(\lambda)$ 与波长 $\lambda$ 之间呈比例关系，又已知偏转角 $\delta(\lambda)$ 与波长 $n(\lambda)$ 之间也呈比例关系，那么相邻频段光线的波长之差自然也是一个近似的比例关系了。

在实际研究中，研究者采用的是“通过固定的平移步长 $d$ 来反求需要的波长频段”的策略。以 CASSI 系统常用的 CAVE 数据集[^ParkCAVEdataset]为例，研究者使用的是一个 28 波段的子集（宽高有 1024x1024 和 512x512 两种）。在由 $F'$ 投影到 $F''$ 的过程中，我们固定了两个相邻波段之间的平移步长 $d$ 为 2 个像素，于是从第一个波段开始到最后一个波段结束，一共平移了 $(28 - 1) \times 2 = 54$ 个像素。但是实际上这 28 个波段的波长分别为 {453.5, 457.5, 462.0, 466.0, 471.5, 476.5, 481.5, 487.0, 492.5, 498.0, 504.0, 510.0, 516.0, 522.5, 529.5, 536.5, 544.0, 551.5, 558.5, 567.5, 575.5, 584.5, 594.5, 604.0, 614.5, 625.0, 636.5, 648.0} nm。很明显，两个相邻波段之间的波长并不是等差的。不过这些具体数值并不需要记忆，随用随查就行，实际做图的时候在红（620-760）、绿（490-570）、蓝（440-490）之间各挑一个就差不多得了，我看 Yuanhao Cai 每篇论文也不挑固定值。

### 曝光过程：$F'' \to Y$

这个步骤是最没有压力和技术含量的一步，其目的就是计算出传感器阵列每个位置上接受到的光强。根据我们前面提到的“传感器都是色盲”这一事实，对于传感器上的任意一个像素点 $(u, v)$ 而言，其接受到的光强 $Y(u, v)$ 就是 $F''$ 中所有波长在 $(u, v)$ 处的像素值之和，即

$$
Y'(u, v) = \sum_{n_\lambda=1}^{n_\lambda} F''(u, v, n_\lambda)
$$

**且慢！**因为我们在这里加入了传感器，而众所周知，光电传感器本身是会产生噪声的，因此在实际成像过程中，我们还要考虑加上噪声 $E$ 的干扰，即

$$
Y(u, v) = \sum_{n_\lambda=1}^{n_\lambda} F''(u, v, n_\lambda) + E
$$

其中 $E$ 是所有噪声的统合，包括读出噪声、暗电流噪声、散粒噪声等等。在实际研究中，我们通常假设 $E$ 是高斯白噪声。实际上甚至不用纠结这个噪声的符号，有用 $E$ 的[^yuanSnapshotCompressiveImaging2021a]，有用 $G$ 的[^caiMaskguidedSpectralwiseTransformer2022][^caiCoarsetofineSparseTransformer2022]，要是不怕和波段数符号混起来甚至可以用 $N$ [^heSelfsupervisedLearningSpectral2025]。

### 模型简化

上面罗里吧嗦的推了一大堆，但是除非你真的想凑字数，不然论文里面稍微带一带就足够了，毕竟宝贵的空间应该留给自己需要的方法的公式。

如果我们重新回看 CASSI 的成像系统，我们会发现我们其实可以把成像系统中的掩膜和棱镜（以及可能存在的 relay lens）看作一个整体 $\Phi$，它们共同完成了对三维数据 $F$ 到纯净测量值 $Y'$ 的线性变换；而整个系统的另一个不确定项是传感器自身引入的噪声。因此，我们可以将整个 CASSI 系统建模为一个线性系统加上噪声，即

$$
y = \Phi x + n
$$

其中 $x \in \mathbb{R}^{H \times W \times n_\lambda}$ 是待重建的三维高光谱数据，$\Phi \in \mathbb{R}^{H(W + d(n_\lambda-1)) \times H \times W \times n_\lambda}$ 是成像系统的测量矩阵， $y \in \mathbb{R}^{H(W + d(n_\lambda-1))}$ 是观测到的测量值， $n \in \mathbb{R}^{H(W + d(n_\lambda-1))}$ 是系统噪声。高光谱重建任务的目标就是从观测到的测量值 $y$ 中尽可能精确地恢复出原始的高光谱数据 $x$。

## 重建的通用流程

要开学没时间写了，之后慢慢补上吧，至少第二重要的前向数理模型写完整了，做起来不至于一头雾水。

在本章和下一章中，我预计会介绍高度抽象化的 $Y \to H \to X$ 这一过程，也就是高光谱重建任务；以及历史和现在出现过的主要几类重建方法，它们使用什么样的思想解决了高光谱重建任务中的什么问题，又留下了哪些问题和局限性，后人的工作又是如何解决这些局限性的。理论上如果能完全理解的话，不敢说会产生什么新的 idea（我也想有啊），但是至少不会在没有方向性的改进上浪费时间。

## 四种主要重建方式

### 1. 基于模型的重建 (Model-based)

### 2. 即插即用 (Plug-and-Play)

### 3. 端到端深度学习 (End-to-End Deep Learning)

### 4. 深度展开 (Deep Unfolding)

## 重建任务常用数据集

### The Columbia Imaging and Vision Laboratory (CAVE) dataset [^ParkCAVEdataset]

### Korea Advanced Institute of Science & Technology (KAIST) dataset[^choiHighqualityHyperspectralReconstruction2017]

## 参考文献

[^yuanSnapshotCompressiveImaging2021a]: Yuan, X., Brady, D. J., & Katsaggelos, A. K.: Snapshot compressive imaging: Theory, algorithms, and applications. IEEE Signal Processing Magazine, 38(2), 65–88 (2021).

[^shahHyperspectralSensorsAutonomous2026]: Shah, I. A., Li, J., George, R., Brophy, T., Ward, E., Glavin, M., Jones, E., & Deegan, B.: Hyperspectral Sensors and Autonomous Driving: Technologies, Limitations, and Opportunities. IEEE Open Journal of Vehicular Technology, 7, 124-143 (2026).

[^goetzThreeDecadesHyperspectral2009]: Goetz, A. F. H.: Three decades of hyperspectral remote sensing of the earth: A personal view. Remote Sensing of Environment, 113, S5–S16 (2009).

[^vaneAirborneVisibleInfrared1987]: Vane, G.: Airborne visible/infrared imaging spectrometer (AVIRIS): A description of the sensor, ground data processing facility, laboratory calibration, and first results. (1987).

[^pearlmanHyperionSpacebasedImaging2003]: Pearlman, J. S., Barry, P. S., Segal, C. C., Shepanski, J., Beiso, D., & Carman, S. L.: Hyperion, a space-based imaging spectrometer. IEEE Transactions on Geoscience and Remote Sensing, 41(6), 1160–1173 (2003).

[^duPrismbasedSystemMultispectral2009]: Du, H., Tong, X., Cao, X., & Lin, S.: A prism-based system for multispectral video acquisition. 2009 IEEE 12th International Conference on Computer Vision, 175-182 (2009).

[^wagadarikarSingleDisperserDesign2008]: Wagadarikar, A., John, R., Willett, R., & Brady, D.: Single disperser design for coded aperture snapshot spectral imaging. Appl. Opt., 47(10), B44–B51 (2008).

[^llullCodedApertureCompressive2013]: Llull, P., Liao, X., Yuan, X., Yang, J., Kittle, D., Carin, L., Sapiro, G., & Brady, D. J.: Coded aperture compressive temporal imaging. Optics Express, 21(9), 10526-10545 (2013).

[^wagadarikarVideoRateSpectral2009]: Wagadarikar, A. A., Pitsianis, N. P., Sun, X., & Brady, D. J.: Video rate spectral imaging using a coded aperture snapshot spectral imager. Optics Express, 17(8), 6368-6388 (2009).

[^yuanCompressiveHyperspectralImaging2015]: Yuan, X., Tsai, T., Zhu, R., Llull, P., Brady, D., & Carin, L.: Compressive hyperspectral imaging with side information. IEEE Journal of Selected Topics in Signal Processing, 9(6), 964-976 (2015).

[^gehmSingleshotCompressiveSpectral2007]: Gehm, M. E., John, R., Brady, D. J., Willett, R. M., & Schulz, T. J.: Single-shot compressive spectral imaging with a dual-disperser architecture. Optics Express, 15(21), 14013–14027 (2007).

[^caiCoarsetofineSparseTransformer2022]: Cai, Y., Lin, J., Hu, X., Wang, H., Yuan, X., Zhang, Y., Timofte, R., & Gool, L. V.: Coarse-to-fine sparse transformer for hyperspectral image reconstruction. ECCV (2022).

[^mengEndtoendLowCost2020TSA]: Meng, Z., Ma, J., & Yuan, X.: End-to-end low cost compressive spectral imaging with spatial-spectral self-attention. Computer Vision – ECCV 2020, 187-204 (2020).

[^ParkCAVEdataset]: Park, J., Lee, M., Grossberg, M. D., & Nayar, S. K.: Multispectral imaging using multiplexed illumination. 2007 IEEE 11th International Conference on Computer Vision, 1-8 (2007).

[^caiMaskguidedSpectralwiseTransformer2022]: Cai, Y., Lin, J., Hu, X., Wang, H., Yuan, X., Zhang, Y., Timofte, R., & Gool, L. V.: Mask-guided Spectral-wise Transformer for Efficient Hyperspectral Image Reconstruction. (2022).

[^heSelfsupervisedLearningSpectral2025]: He, Z., Wang, L., Meng, Z., & Yuan, X.: Self-supervised learning with spectral low-rank prior for hyperspectral image reconstruction. 2025 IEEE/CVF Winter Conference on Applications of Computer Vision (WACV), 9136-9145 (2025).

[^choiHighqualityHyperspectralReconstruction2017]: Choi, I., Kim, M. H., Gutierrez, D., Jeon, D. S., & Nam, G.: High-quality hyperspectral reconstruction using a spectral prior. ACM trans. graph. (2017).
